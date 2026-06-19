import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

const FUCHSIA = '#FF179C';
const VIOLET = '#9B6CFF';
const PINK = '#FF8AD0';

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
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
      <div style={blob(20, 10, 760, FUCHSIA, 0, 8, 0.45)} />
      <div style={blob(70, 60, 680, VIOLET, 2.1, 10, 0.4)} />
      <div style={blob(45, 80, 560, PINK, 4.0, 9, 0.4)} />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(120% 100% at 50% 50%, transparent 60%, rgba(255,255,255,0.6) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
