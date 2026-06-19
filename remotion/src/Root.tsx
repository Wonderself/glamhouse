import React from 'react';
import {Composition} from 'remotion';
import {HeroFilm} from './HeroFilm';
import {AuroraLoop} from './AuroraLoop';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HeroFilm"
        component={HeroFilm}
        durationInFrames={210}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="AuroraLoop"
        component={AuroraLoop}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
