import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

const FUCHSIA = '#C6FF3D'; // acid
const VIOLET = '#21F0DC'; // cyan
const PINK = '#5B8CFF'; // electric blue

// Boucle parfaite : tout est piloté par des sinus de période = durée totale.
export const AuroraLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const T = (frame / durationInFrames) * Math.PI * 2;
  const blob = (
    cx: number,
    cy: number,
    r: number,
    color: string,
    phase: number,
    amp: number,
    op: number
  ) => ({
    position: 'absolute' as const,
    width: r,
    height: r,
    left: `${cx + Math.cos(T + phase) * amp}%`,
    top: `${cy + Math.sin(T + phase) * amp}%`,
    background: `radial-gradient(circle, ${color}, transparent 60%)`,
    filter: 'blur(120px)',
    opacity: op,
  });
  return (
    <AbsoluteFill style={{background: '#04060A', overflow: 'hidden'}}>
      <div style={blob(20, 10, 820, FUCHSIA, 0, 8, 0.5)} />
      <div style={blob(72, 62, 720, VIOLET, 2.1, 10, 0.45)} />
      <div style={blob(46, 82, 600, PINK, 4.0, 9, 0.4)} />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(4,6,10,0.8) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
