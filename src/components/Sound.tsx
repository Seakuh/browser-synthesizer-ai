import React, {useEffect, useRef, useState} from 'react';
import {Hand} from "@tensorflow-models/hand-pose-detection/dist/types";

interface SoundProps {
    hands: Hand[];
}

const Sound: React.FC<SoundProps> = ({ hands }) => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const oscillatorRef = useRef<OscillatorNode | null>(null);
    const [isAudioStarted, setIsAudioStarted] = useState(false);

    const startAudio = () => {
        if (!isAudioStarted) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            oscillatorRef.current = audioContextRef.current.createOscillator();

            if (oscillatorRef.current) {
                oscillatorRef.current.type = 'sine';
                oscillatorRef.current.start();
                oscillatorRef.current.connect(audioContextRef.current.destination);
            }

            setIsAudioStarted(true);
        }
    };

    useEffect(() => {
        return () => {
            // Clean up the audio context and oscillator when the component unmounts
            oscillatorRef.current?.stop();
            audioContextRef.current?.close();
        };
    }, []);

    useEffect(() => {
        const hand = hands[0];
        if (hand && oscillatorRef.current && audioContextRef.current) {
            // Find the positions of the thumb tip and index finger tip
            const thumbTip = hand.keypoints.find((point) => point.name === 'thumb_tip');
            const indexTip = hand.keypoints.find((point) => point.name === 'index_finger_tip');

            if (thumbTip && indexTip) {
                // Calculate the Euclidean distance between the thumb tip and index finger tip
                const distance = Math.sqrt(
                    Math.pow(indexTip.x - thumbTip.x, 2) + Math.pow(indexTip.y - thumbTip.y, 2)
                );

                // Map the distance to a frequency range (e.g., 100 Hz to 1000 Hz)
                const minFrequency = 100;
                const maxFrequency = 1000;
                const frequency = Math.min(
                    maxFrequency,
                    Math.max(minFrequency, (distance / 300) * maxFrequency)
                );

                // Set the frequency of the oscillator
                oscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
            }
        }
    }, [hands, isAudioStarted]);

    return (
        <div>
            <button onClick={startAudio} disabled={isAudioStarted}>
                {isAudioStarted ? 'Audio Started' : 'Start Audio'}
            </button>
            <div>Adjust the distance between your thumb and index finger to change the sound frequency.</div>
        </div>
    );
};

export default Sound;