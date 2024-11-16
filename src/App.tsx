import ml5 from "ml5";
import * as p5Types from "p5";
import React from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";

// Global variables for p5.js
let osc: p5Types.Oscillator;
let fft: p5Types.FFT;
let handpose: any;
let video: p5Types.Element;
let predictions: any[] = [];

const Sketch = (p5: p5Types) => {
  p5.setup = () => {
    p5.createCanvas(800, 400);
    video = p5.createCapture(p5.VIDEO);
    video.size(640, 480);
    video.hide();

    // Initialize Handpose model
    handpose = ml5.handpose(video.elt, () => {
      console.log("Handpose model loaded");
    });

    // Listen for new predictions
    handpose.on("predict", (results: any) => {
      predictions = results;
    });

    // Synthesizer setup
    osc = new p5.Oscillator("sine");
    fft = new p5.FFT();
    osc.amp(0);
    osc.start();
  };

  p5.draw = () => {
    p5.background(30);
    p5.image(video, 0, 0, 320, 240);

    if (predictions.length > 0) {
      const hand = predictions[0];
      const [x, y] = hand.landmarks[9]; // Use the tip of the index finger
      const freq = p5.map(x, 0, p5.width, 100, 1000);
      const amp = p5.map(y, 0, p5.height, 1, 0);

      // Update synthesizer
      osc.freq(freq);
      osc.amp(amp, 0.1);

      // Draw hand landmarks
      p5.stroke(0, 255, 0);
      p5.strokeWeight(4);
      hand.landmarks.forEach(([x, y]: [number, number]) => {
        p5.point(x, y);
      });

      // Display frequency and amplitude
      p5.fill(255);
      p5.textSize(16);
      p5.text(`Frequency: ${freq.toFixed(2)} Hz`, 20, 300);
      p5.text(`Amplitude: ${amp.toFixed(2)}`, 20, 320);
    }

    // Draw Oscilloscope
    const waveform = fft.waveform();
    p5.stroke(255, 255, 0);
    p5.noFill();
    p5.beginShape();
    for (let i = 0; i < waveform.length; i++) {
      const x = p5.map(i, 0, waveform.length, 0, p5.width);
      const y = p5.map(waveform[i], -1, 1, 0, p5.height);
      p5.vertex(x, y);
    }
    p5.endShape();
  };

  p5.mouseReleased = () => {
    osc.amp(0, 0.5); // Fade out sound when mouse is released
  };
};

const App: React.FC = () => {
  return (
    <div>
      <h1>Gesture Synthesizer with ml5.js</h1>
      <ReactP5Wrapper sketch={Sketch} />
    </div>
  );
};

export default App;
