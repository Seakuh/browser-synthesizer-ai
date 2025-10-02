import { useEffect, useRef, useState } from 'react';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import {MediaPipeHandsMediaPipeModelConfig} from "@tensorflow-models/hand-pose-detection/dist/mediapipe/types";
import {Hand} from "@tensorflow-models/hand-pose-detection/dist/types";

export const useHandPoseDetection = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [hands, setHands] = useState<Hand[]>([]);

    useEffect(() => {
        let isActive = true;

        const detectHands = async (detector: handPoseDetection.HandDetector) => {
            if (videoRef.current && isActive) {
                const detectedHands = await detector.estimateHands(videoRef.current);
                setHands(detectedHands);
                requestAnimationFrame(() => detectHands(detector));
            }
        };

        const loadModelAndDetect = async () => {
            const model = handPoseDetection.SupportedModels.MediaPipeHands;
            const detectorConfig: MediaPipeHandsMediaPipeModelConfig = {
                runtime: 'mediapipe',
                solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
                modelType: 'full'
            };
            const detector = await handPoseDetection.createDetector(model, detectorConfig);

            if (videoRef.current && isActive) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: { width: 640, height: 480, facingMode: 'user' }
                    });
                    videoRef.current.srcObject = stream;

                    videoRef.current.onloadedmetadata = () => {
                        if (videoRef.current && isActive) {
                            videoRef.current.play();
                            detectHands(detector);
                        }
                    };
                } catch (error) {
                    console.error('Camera access error:', error);
                }
            }
        };

        loadModelAndDetect();

        return () => {
            isActive = false;
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return { videoRef, hands };
};