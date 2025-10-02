import { useEffect, useRef, useState } from 'react';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import {MediaPipeHandsMediaPipeModelConfig} from "@tensorflow-models/hand-pose-detection/dist/mediapipe/types";
import {Hand} from "@tensorflow-models/hand-pose-detection/dist/types";

export const useHandPoseDetection = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [hands, setHands] = useState<Hand[]>([]);

    useEffect(() => {
        const loadModelAndDetect = async () => {
            const model = handPoseDetection.SupportedModels.MediaPipeHands;
            const detectorConfig: MediaPipeHandsMediaPipeModelConfig = {
                runtime: 'mediapipe',
                solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
                modelType: 'full'
            };
            const detector = await handPoseDetection.createDetector(model, detectorConfig);

            if (videoRef.current) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: { width: 640, height: 480, facingMode: 'user' }
                    });
                    videoRef.current.srcObject = stream;

                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play();
                        detectHands(detector);
                    };
                } catch (error) {
                    console.error('Camera access error:', error);
                }
            }
        };

        const detectHands = async (detector: any) => {
            if (videoRef.current) {
                const detectedHands = await detector.estimateHands(videoRef.current);
                setHands(detectedHands);
                requestAnimationFrame(() => detectHands(detector));
            }
        };

    // Only load model when the window is fully loaded
    window.addEventListener('load', loadModelAndDetect);

    return () => {
      window.removeEventListener('load', loadModelAndDetect);
    };
    }, [videoRef.current]);

    return { videoRef, hands };
};