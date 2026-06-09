import type { InterestCheck } from './types';

// Small front-end helpers for the Interest Check UI. No shared currency util exists on
// this branch, so these are local; a backend would compute the same from real pledges.

export function formatCents(cents: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function daysUntil(iso: string): number {
  if (!iso) return 0;
  const ms = new Date(iso).getTime() - Date.now();
  if (Number.isNaN(ms)) return 0;
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function formatDateLabel(iso: string): string {
  if (!iso) return 'Date TBD';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
}

/** Pledges that still count toward interest (authorized or charged, not released). */
export function activePledges(ic: InterestCheck) {
  return ic.pledges.filter((p) => p.state !== 'released');
}

/** Everyone who pre-committed (any state), e.g. "18 interested". */
export function interestedCount(ic: InterestCheck): number {
  return ic.pledges.length;
}

export function committedCents(ic: InterestCheck): number {
  return activePledges(ic).reduce((sum, p) => sum + p.authorizedAmountCents, 0);
}

export interface ThresholdProgress {
  current: number;
  goal: number;
  pct: number;
  met: boolean;
  label: string;
}

export function thresholdProgress(ic: InterestCheck): ThresholdProgress {
  if (ic.threshold.unit === 'amount') {
    const goalCents = ic.threshold.value * 100;
    const current = committedCents(ic);
    const pct = goalCents > 0 ? Math.min(100, (current / goalCents) * 100) : 0;
    return {
      current,
      goal: goalCents,
      pct,
      met: current >= goalCents,
      label: `${formatCents(current)} of ${formatCents(goalCents)} committed`,
    };
  }
  const goal = ic.threshold.value;
  const current = interestedCount(ic);
  const pct = goal > 0 ? Math.min(100, (current / goal) * 100) : 0;
  return {
    current,
    goal,
    pct,
    met: current >= goal,
    label: `${current} of ${goal} people in`,
  };
}

/** The proposed date with the most pledge votes (ties resolve to display order). */
export function leadingDateId(ic: InterestCheck): string | undefined {
  if (ic.proposedDates.length === 0) return undefined;
  if (ic.proposedDates.length === 1) return ic.proposedDates[0]?.id;
  let bestId = ic.proposedDates[0]?.id;
  let bestVotes = -1;
  for (const d of ic.proposedDates) {
    const votes = ic.pledges.filter((p) => p.dateChoice.includes(d.id)).length;
    if (votes > bestVotes) {
      bestVotes = votes;
      bestId = d.id;
    }
  }
  return bestId;
}

export function statusLabel(status: InterestCheck['status']): string {
  switch (status) {
    case 'draft':
      return 'Draft';
    case 'open':
      return 'Active';
    case 'confirmed':
      return 'Confirmed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}
