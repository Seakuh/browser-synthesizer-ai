import React, { useEffect, useRef, useState } from "react";
import * as handpose from "@tensorflow-models/handpose";
import "@tensorflow/tfjs";

// FrequencyBar-Komponente
const FrequencyBar: React.FC<{ frequency: number }> = ({ frequency }) => {
  const minFreq = 100; // Mindestfrequenz
  const maxFreq = 2000; // Maximalfrequenz
  const percentage = ((frequency - minFreq) / (maxFreq - minFreq)) * 100;

  return (
    <div style={{ marginTop: "20px", width: "80%", margin: "0 auto" }}>
      <div
        style={{
          height: "20px",
          backgroundColor: "#ddd",
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percentage}%`,
            backgroundColor: "#4caf50",
            transition: "width 0.1s ease-in-out",
          }}
        ></div>
      </div>
      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Frequency: {frequency.toFixed(2)} Hz
      </p>
    </div>
  );
};

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<handpose.HandPose>();
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
  const [frequency, setFrequency] = useState(440); // Initialfrequenz

  useEffect(() => {
    // Webcam einrichten und Handpose-Modell laden
    const loadModelAndWebcam = async () => {
      const video = videoRef.current;
      if (video) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.play();

        const loadedModel = await handpose.load();
        setModel(loadedModel);
      }
    };

    loadModelAndWebcam();

    // Audio initialisieren
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioContext(audioCtx);

    const osc = audioCtx.createOscillator();
    osc.type = "sine"; // Wellenform: Sinus
    osc.frequency.setValueAtTime(440, audioCtx.currentTime); // Standardfrequenz (440 Hz)
    osc.start();

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.2; // Lautstärke

    osc.connect(gainNode).connect(audioCtx.destination);
    setOscillator(osc);

    return () => {
      osc.stop();
      osc.disconnect();
    };
  }, []);

  useEffect(() => {
    // Hand erkennen und Ton ändern
    const detectHands = async () => {
      if (model && videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const detect = async () => {
          const predictions = await model.estimateHands(video);

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          if (predictions.length > 0) {
            const hand = predictions[0];
            const z = hand.landmarks[9][2]; // Z-Koordinate des Mittelfingers

            if (oscillator) {
              // Berechne Frequenz basierend auf Z-Koordinate
              const newFrequency = 440 - z * 100; // Näher = höhere Frequenz
              const clampedFrequency = Math.max(100, Math.min(newFrequency, 2000));

              oscillator.frequency.setValueAtTime(
                clampedFrequency,
                audioContext!.currentTime
              );
              setFrequency(clampedFrequency); // Frequenz aktualisieren
            }

            // Zeichne Handlandmarks
            hand.landmarks.forEach(([x, y]) => {
              ctx.beginPath();
              ctx.arc(x, y, 5, 0, Math.PI * 2);
              ctx.fillStyle = "lime";
              ctx.fill();
            });
          }

          requestAnimationFrame(detect);
        };

        detect();
      }
    };

    detectHands();
  }, [model, oscillator, audioContext]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Handpose Detection mit Ton</h1>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ border: "1px solid black" }} />
      {/* FrequencyBar-Komponente einfügen */}
      <FrequencyBar frequency={frequency} />
    </div>
  );
};

export default App;
