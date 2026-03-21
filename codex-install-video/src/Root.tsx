import React from 'react';
import { Composition } from 'remotion';
import { CodexInstallVideo } from './CodexInstallVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MyComposition"
      component={CodexInstallVideo}
      durationInFrames={200}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};