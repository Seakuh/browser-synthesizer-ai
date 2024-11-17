import {Hand} from "@tensorflow-models/hand-pose-detection/dist/types";
import {FC, RefObject, useEffect, useRef} from "react";

interface HandPointsCanvasProps {
    hands: Hand[];
    videoRef: RefObject<HTMLVideoElement>;
}

const HandPointsCanvas: FC<HandPointsCanvasProps> = ({ hands, videoRef }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.width = videoRef.current?.videoWidth || 0;
            canvasRef.current.height = videoRef.current?.videoHeight || 0;
        }
        const drawCanvas = () => {
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    hands.forEach((hand) => {
                        hand.keypoints.forEach((keypoint: any) => {
                            ctx.beginPath();
                            ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
                            ctx.fillStyle = 'red';
                            ctx.fill();
                        });
                    });
                }
            }
        };

        requestAnimationFrame(drawCanvas);
    }, [hands, videoRef.current]);

    return (
        <canvas ref={canvasRef} style={{position: 'absolute', top: 0, left: 0}}></canvas>
    );
};

export default HandPointsCanvas;