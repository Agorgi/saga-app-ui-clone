'use client';
import type React from 'react';
import { useEffect, useState } from 'react';
import styles from './CelebrationBurst.module.scss';

export type CelebrationTheme = 'contribute' | 'vote';

interface CelebrationBurstProps {
  show: boolean;
  theme: CelebrationTheme;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  tx: number;
  ty: number;
  size: number;
  color: string;
  shapeR: string;
  dur: number;
  delay: number;
  rot: number;
}

type CSSWithVars = React.CSSProperties & Record<`--${string}`, string | number>;

const CONTRIBUTE_COLORS = ['#fbbf24', '#f59e0b', '#fde68a', '#d97706', '#fef3c7', '#fcd34d'];
const VOTE_COLORS = ['#818cf8', '#6366f1', '#a5b4fc', '#7779ed', '#c7d2fe', '#4f46e5'];

const MESSAGES: Record<CelebrationTheme, string> = {
  contribute: "✨ You're backing this!",
  vote: '🎉 Your voice matters!',
};

const RING_COLORS: Record<CelebrationTheme, string> = {
  contribute: 'rgba(251, 191, 36, 0.45)',
  vote: 'rgba(99, 102, 241, 0.45)',
};

const TEXT_COLORS: Record<CelebrationTheme, string> = {
  contribute: '#fbbf24',
  vote: '#a5b4fc',
};

const RING_STYLES: Record<CelebrationTheme, CSSWithVars> = {
  contribute: { '--ring-color': RING_COLORS.contribute },
  vote: { '--ring-color': RING_COLORS.vote },
};

const TEXT_STYLES: Record<CelebrationTheme, CSSWithVars> = {
  contribute: { '--text-color': TEXT_COLORS.contribute },
  vote: { '--text-color': TEXT_COLORS.vote },
};

function particleStyle(p: Particle): CSSWithVars {
  return {
    '--tx': `${p.tx}px`,
    '--ty': `${p.ty}px`,
    '--size': `${p.size}px`,
    '--color': p.color,
    '--shape-r': p.shapeR,
    '--dur': `${p.dur}ms`,
    '--delay': `${p.delay}ms`,
    '--rot': `${p.rot}deg`,
  };
}

function makeParticles(theme: CelebrationTheme): Particle[] {
  const colors = theme === 'contribute' ? CONTRIBUTE_COLORS : VOTE_COLORS;
  return Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const dist = 28 + Math.random() * 32;
    return {
      id: i,
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist,
      size: 4 + Math.random() * 7,
      color: colors[i % colors.length] ?? '#fbbf24',
      shapeR: Math.random() > 0.4 ? '50%' : '3px',
      dur: 550 + Math.random() * 250,
      delay: Math.random() * 80,
      rot: Math.random() * 360,
    };
  });
}

const BURST_LIFETIME_MS = 2000;

export function CelebrationBurst({ show, theme, onComplete }: CelebrationBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!show) {
      setParticles([]);
      return;
    }
    setParticles(makeParticles(theme));
    const timer = setTimeout(() => {
      onComplete?.();
    }, BURST_LIFETIME_MS);
    return () => clearTimeout(timer);
  }, [show, theme, onComplete]);

  if (!show) return null;

  return (
    <div className={styles.overlay} aria-hidden="true">
      <div className={styles.ring} style={RING_STYLES[theme]} />
      {particles.map((p) => (
        <div key={p.id} className={styles.particle} style={particleStyle(p)} />
      ))}
      <div className={styles.text} style={TEXT_STYLES[theme]}>
        {MESSAGES[theme]}
      </div>
    </div>
  );
}
