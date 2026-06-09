import { constants } from '@saga/config-web';

/** Donation amount presets shared across poll components */
export const DONATION_PRESETS = constants.crowdCommissions.validVoteAmountsCents.map((cents) => ({
  label: `$${cents / 100}`,
  cents,
}));

/** Data-agnostic poll option shape used across all poll components */
export interface PollOptionData {
  id: string;
  text: string;
  imageUrl?: string | null;
  voteCount: number;
  voterCount: number;
  displayOrder: number;
}

/** Option color palette — one per slot, 0-indexed */
export const OPTION_COLORS = [
  '#F43F5E', // Rose (slot 0)
  '#F97316', // Orange (slot 1)
  '#8B5CF6', // Violet (slot 2)
  '#06B6D4', // Cyan (slot 3)
  '#10B981', // Emerald (slot 4)
] as const;

/** Countdown label for an active poll deadline. E.g. "3d left", "2h left", "Ended". */
export function formatPollDeadline(deadlineAt: string): string {
  const diff = new Date(deadlineAt).getTime() - Date.now();
  if (diff <= 0) return 'Ended';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days}d left`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours}h left`;
  return 'Ending soon';
}
