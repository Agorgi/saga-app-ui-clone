import type { CSSProperties } from 'react';

const HERO_TITLE_MIN_REM = 1.125;
const HERO_TITLE_MAX_REM = 3.5;
/** Title length that renders at the largest hero size. */
const HERO_TITLE_COMFORT_LENGTH = 24;

interface EventHeroTitleStyle extends CSSProperties {
  '--hero-title-size': string;
}

/** Scales hero title font size down as name length grows (inverse proportion). */
export function getEventHeroTitleFontSize(nameLength: number): string {
  if (nameLength <= HERO_TITLE_COMFORT_LENGTH) {
    return `${HERO_TITLE_MAX_REM}rem`;
  }

  const scaled = Math.max(
    HERO_TITLE_MIN_REM,
    (HERO_TITLE_MAX_REM * HERO_TITLE_COMFORT_LENGTH) / nameLength,
  );

  return `${scaled.toFixed(3)}rem`;
}

export function getEventHeroTitleStyle(name: string): EventHeroTitleStyle {
  return {
    '--hero-title-size': getEventHeroTitleFontSize(name.length),
  };
}
