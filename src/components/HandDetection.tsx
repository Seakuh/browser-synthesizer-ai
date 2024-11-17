import React, {FC} from 'react';
import {useHandPoseDetection} from '../hooks/useHandPoseDetection';
import HandPointsCanvas from "./HandPointsCanvas";
import Sound from "./Sound";

const HandDetection: FC = () => {
    const { videoRef, hands } = useHandPoseDetection();

    return (
        <div>
            <h1>Hand Detection</h1>
            <div style={{ position: 'relative' }}>
                <video ref={videoRef} autoPlay muted></video>
                <HandPointsCanvas hands={hands} videoRef={videoRef} />
                <Sound hands={hands} />
            </div>
        </div>
    );
};

export default HandDetection;