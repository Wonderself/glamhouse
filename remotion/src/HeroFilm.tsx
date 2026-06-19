import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';
// Polices système (le chromium de rendu n'a pas accès aux webfonts dans ce bac à sable).
const syne = "'Arial Black', 'Helvetica Neue', Helvetica, 'DejaVu Sans', sans-serif";
const mono = "'DejaVu Sans Mono', 'Courier New', monospace";

// Palette "lab électrique" : vert acide + cyan électrique sur noir profond.
const FUCHSIA = '#C6FF3D'; // acid (nom conservé pour limiter les diffs)
const VIOLET = '#21F0DC'; // cyan
const INK = '#04060A';

// ---- fond aurora + grille perspective ----
const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = frame / durationInFrames;
  const floorShift = (frame * 6) % 80;
  const b1x = interpolate(Math.sin(frame / 40), [-1, 1], [-10, 25]);
  const b1y = interpolate(Math.cos(frame / 55), [-1, 1], [-5, 20]);
  const b2x = interpolate(Math.cos(frame / 48), [-1, 1], [10, -20]);
  return (
    <AbsoluteFill style={{background: INK, overflow: 'hidden'}}>
      {/* blobs */}
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          left: `${20 + b1x}%`,
          top: `${-30 + b1y}%`,
          background: `radial-gradient(circle, ${FUCHSIA}, transparent 60%)`,
          filter: 'blur(120px)',
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 760,
          height: 760,
          right: `${-10 + b2x}%`,
          top: '20%',
          background: `radial-gradient(circle, ${VIOLET}, transparent 60%)`,
          filter: 'blur(130px)',
          opacity: 0.5,
        }}
      />
      {/* grille sol en perspective */}
      <div
        style={{
          position: 'absolute',
          left: '-30%',
          right: '-30%',
          bottom: '-12%',
          height: '70%',
          transform: 'perspective(560px) rotateX(72deg)',
          transformOrigin: 'bottom center',
          backgroundImage: `linear-gradient(${FUCHSIA}55 1px, transparent 1px), linear-gradient(90deg, ${FUCHSIA}33 1px, transparent 1px)`,
          backgroundSize: `80px 80px`,
          backgroundPosition: `0px ${floorShift}px`,
          maskImage: 'linear-gradient(to top, #000 10%, transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to top, #000 10%, transparent 80%)',
          opacity: 0.7,
        }}
      />
      {/* halo central */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 50% at 50% 42%, ${FUCHSIA}22, transparent 70%)`,
          opacity: interpolate(t, [0, 0.3, 1], [0, 1, 1]),
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

// ---- maison filaire qui se dessine + flotte ----
const WireHouse: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const draw = spring({frame, fps, config: {damping: 200}, durationInFrames: 60});
  const dash = 3000;
  const offset = interpolate(draw, [0, 1], [dash, 0]);
  const float = Math.sin(frame / 26) * 7;
  const rot = interpolate(frame, [0, 210], [-6, 6]);
  const appear = interpolate(frame, [6, 40], [0, 1], {extrapolateRight: 'clamp'});
  const detail = interpolate(draw, [0.55, 1], [0, 1], {extrapolateLeft: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateY(${-46 + float}px)`,
        opacity: appear,
      }}
    >
      <svg
        width={560}
        height={460}
        viewBox="0 0 560 460"
        style={{
          filter: `drop-shadow(0 0 32px ${FUCHSIA}66)`,
          transform: `scale(${0.92 + draw * 0.08}) rotateZ(${rot * 0.08}deg)`,
        }}
      >
        {/* faces pleines (volume clair et lisible) */}
        <g style={{opacity: draw * 0.9}}>
          <polygon points="270,120 440,200 270,290 120,210" fill="rgba(198,255,61,0.12)" />
          <polygon points="120,210 270,290 270,420 120,330" fill="rgba(33,240,220,0.06)" />
          <polygon points="270,290 440,200 440,330 270,420" fill="rgba(33,240,220,0.13)" />
        </g>
        {/* arêtes néon, tracé progressif */}
        <g
          fill="none"
          strokeWidth={2.8}
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{strokeDasharray: dash, strokeDashoffset: offset}}
        >
          <polygon points="270,120 440,200 270,290 120,210" stroke={FUCHSIA} />
          <polygon points="120,210 270,290 270,420 120,330" stroke={VIOLET} />
          <polygon points="270,290 440,200 440,330 270,420" stroke={VIOLET} />
        </g>
        {/* fenêtres + porte (apparaissent ensuite) */}
        <g style={{opacity: detail}} strokeWidth={2} strokeLinejoin="round">
          <polygon points="300,300 410,245 410,300 300,355" fill="rgba(33,240,220,0.45)" stroke="#fff" />
          <polygon points="150,250 215,285 215,330 150,295" fill="rgba(33,240,220,0.30)" stroke="#fff" />
          <polygon points="235,320 270,340 270,400 235,380" fill="rgba(198,255,61,0.22)" stroke={FUCHSIA} />
        </g>
        {/* toit : panneau solaire + lanterneau */}
        <g style={{opacity: detail}}>
          <polygon points="245,168 320,168 342,196 267,196" fill="none" stroke="#ffffff" strokeWidth={1.5} opacity={0.7} />
          <circle cx={270} cy={120} r={5} fill="#fff" />
        </g>
      </svg>
    </div>
  );
};

// ---- titre cinétique ----
const KineticTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const word = 'MYGLAMHOUSE'.split('');
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 150,
      }}
    >
      <div style={{display: 'flex', gap: 2}}>
        {word.map((c, i) => {
          const s = spring({
            frame: frame - 30 - i * 3,
            fps,
            config: {damping: 14, stiffness: 120},
          });
          const y = interpolate(s, [0, 1], [80, 0]);
          const o = interpolate(s, [0, 1], [0, 1]);
          const isGlam = i >= 2 && i <= 5; // GLAM
          return (
            <span
              key={i}
              style={{
                fontFamily: syne,
                fontWeight: 800,
                fontSize: 92,
                letterSpacing: '-0.03em',
                color: isGlam ? FUCHSIA : '#fff',
                transform: `translateY(${y}px)`,
                opacity: o,
                textShadow: isGlam ? `0 0 30px ${FUCHSIA}` : 'none',
                lineHeight: 1,
              }}
            >
              {c}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const Tagline: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [70, 95], [0, 1], {extrapolateRight: 'clamp'});
  const o2 = interpolate(frame, [110, 135], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 70,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: mono,
          color: '#fff',
          letterSpacing: '0.4em',
          fontSize: 18,
          textTransform: 'uppercase',
          opacity: o,
        }}
      >
        Construire&nbsp;&nbsp;autrement
      </div>
      <div
        style={{
          fontFamily: mono,
          color: FUCHSIA,
          letterSpacing: '0.3em',
          fontSize: 13,
          textTransform: 'uppercase',
          marginTop: 14,
          opacity: o2,
        }}
      >
        Habitat modulaire · Édition 2027
      </div>
    </div>
  );
};

// ---- balayage lumineux ----
const Sweep: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [40, 90], [-40, 140], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(105deg, transparent ${x - 16}%, ${FUCHSIA}33 ${x}%, transparent ${x + 16}%)`,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}
    />
  );
};

export const HeroFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp'}
  );
  return (
    <AbsoluteFill style={{opacity: fadeOut, fontFamily: syne}}>
      <Backdrop />
      <WireHouse />
      <KineticTitle />
      <Tagline />
      <Sweep />
      {/* corner HUD */}
      <div
        style={{
          position: 'absolute',
          top: 34,
          left: 40,
          fontFamily: mono,
          color: '#ffffffaa',
          fontSize: 13,
          letterSpacing: '0.25em',
        }}
      >
        ● REC · MGH-2027
      </div>
      <div
        style={{
          position: 'absolute',
          top: 34,
          right: 40,
          fontFamily: mono,
          color: '#ffffffaa',
          fontSize: 13,
          letterSpacing: '0.25em',
        }}
      >
        48.85°N · 2.35°E
      </div>
    </AbsoluteFill>
  );
};
