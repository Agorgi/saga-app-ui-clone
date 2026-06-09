import { intervalToDuration } from 'date-fns';

interface TimeLeftUnitConfig {
  key: 'months' | 'days' | 'hours' | 'minutes';
  singularLabel: string;
  pluralLabel: string;
}

const TIME_LEFT_UNITS: readonly TimeLeftUnitConfig[] = [
  { key: 'months', singularLabel: 'month', pluralLabel: 'months' },
  { key: 'days', singularLabel: 'day', pluralLabel: 'days' },
  { key: 'hours', singularLabel: 'hour', pluralLabel: 'hours' },
  { key: 'minutes', singularLabel: 'min', pluralLabel: 'mins' },
];

export function formatDeadline(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function getDaysRemaining(isoDate: string): number {
  const now = new Date();
  const deadline = new Date(isoDate);
  const diffMs = deadline.getTime() - now.getTime();
  if (Number.isNaN(diffMs)) return 0;
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function isDeadlinePassed(isoDate: string): boolean {
  return new Date(isoDate) < new Date();
}

function formatTimeLeftUnit(value: number, singularLabel: string, pluralLabel: string): string {
  return value === 1 ? `1 ${singularLabel}` : `${value} ${pluralLabel}`;
}

/** Short deadline label matching PollCard's format: "3d left", "2h left", "Ending soon", "Ended". */
export function formatShortDeadline(deadlineAt: string): string {
  const diff = new Date(deadlineAt).getTime() - Date.now();
  if (diff <= 0) return 'Ended';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days}d left`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours}h left`;
  return 'Ending soon';
}

export function formatTimeLeft(isoDate: string): string {
  const now = new Date();
  const deadline = new Date(isoDate);

  if (deadline <= now) {
    return 'Ended';
  }

  const duration = intervalToDuration({ start: now, end: deadline });

  const visibleUnits = TIME_LEFT_UNITS.flatMap(({ key, singularLabel, pluralLabel }) => {
    const value = duration[key] ?? 0;

    return value > 0 ? [formatTimeLeftUnit(value, singularLabel, pluralLabel)] : [];
  });

  const countdownText = visibleUnits.slice(0, 2).join(' ');

  if (countdownText === '') {
    return '1 min left';
  }

  return `${countdownText} left`;
}
