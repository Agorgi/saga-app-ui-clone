import { useContext } from 'react';
import { AvatarContext, type AvatarContextValue } from './avatarContextStore';

export function useAvatarContext(): AvatarContextValue {
  return useContext(AvatarContext);
}

/**
 * Deterministically maps a string seed (userId or name) to an index
 * within the provided defaultAvatars array.
 */
export function pickAvatarIndex(seed: string, count: number): number {
  if (count === 0) return 0;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash % count;
}
