import React, { useEffect, useState } from "react";
import * as Tone from "tone";

const TechnoController: React.FC = () => {
  const [bpm, setBpm] = useState(120); // BPM-Wert
  const [kickVolume, setKickVolume] = useState(-6); // Lautstärke für Kick
  const [snareVolume, setSnareVolume] = useState(-12); // Lautstärke für Snare
  const [hihatVolume, setHihatVolume] = useState(-10); // Lautstärke für Hi-Hat

  useEffect(() => {
    // Tone.js Synthesizer-Setup
    const kick = new Tone.MembraneSynth().toDestination();
    const snare = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.001, decay: 0.2, sustain: 0 },
    }).toDestination();
    const hihat = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.3, release: 0.1 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
    }).toDestination();

    // Lautstärke anpassen
    kick.volume.value = kickVolume;
    snare.volume.value = snareVolume;
    hihat.volume.value = hihatVolume;

    // Sequencer erstellen
    const kickPart = new Tone.Part(
      (time) => {
        kick.triggerAttackRelease("C1", "8n", time);
      },
      [["0:0:0"], ["0:2:0"], ["1:0:0"], ["1:2:0"]]
    );

    const snarePart = new Tone.Part(
      (time) => {
        snare.triggerAttackRelease("8n", time);
      },
      [["0:1:0"], ["1:1:0"]]
    );

    const hihatPart = new Tone.Part(
      (time) => {
        hihat.triggerAttackRelease("16n", time);
      },
      [["0:0:2"], ["0:1:2"], ["0:2:2"], ["0:3:2"]]
    );

    kickPart.loop = true;
    kickPart.loopEnd = "2m";
    snarePart.loop = true;
    snarePart.loopEnd = "2m";
    hihatPart.loop = true;
    hihatPart.loopEnd = "2m";

    // BPM anpassen
    Tone.Transport.bpm.value = bpm;

    // Transport starten
    kickPart.start(0);
    snarePart.start(0);
    hihatPart.start(0);

    return () => {
      kickPart.dispose();
      snarePart.dispose();
      hihatPart.dispose();
    };
  }, [bpm, kickVolume, snareVolume, hihatVolume]);

  const startMusic = async () => {
    await Tone.start();
    Tone.Transport.start();
  };

  const stopMusic = () => {
    Tone.Transport.stop();
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1>Techno Controller</h1>
      <div>
        <label>BPM: {bpm}</label>
        <input
          type="range"
          min="60"
          max="200"
          value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label>Kick Volume: {kickVolume} dB</label>
        <input
          type="range"
          min="-48"
          max="0"
          value={kickVolume}
          onChange={(e) => setKickVolume(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label>Snare Volume: {snareVolume} dB</label>
        <input
          type="range"
          min="-48"
          max="0"
          value={snareVolume}
          onChange={(e) => setSnareVolume(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label>Hi-Hat Volume: {hihatVolume} dB</label>
        <input
          type="range"
          min="-48"
          max="0"
          value={hihatVolume}
          onChange={(e) => setHihatVolume(parseInt(e.target.value))}
        />
      </div>
      <button onClick={startMusic} style={{ marginRight: "10px" }}>
        Start
      </button>
      <button onClick={stopMusic}>Stop</button>
    </div>
  );
};

export default TechnoController;
