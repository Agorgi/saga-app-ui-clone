import { useCallback } from 'react';

// Wireframe clone: production starts a Stripe poll-donation checkout and casts the vote
// after payment completes. Both are inert here (no network, no redirect, no state change).

export function usePollCheckout(_commissionId: string) {
  const startCheckout = useCallback(async (_amountCents: number): Promise<void> => {}, []);
  return { isRedirecting: false, startCheckout };
}

export function usePollVote(_commissionId: string) {
  const castVote = useCallback(async (_optionId: string): Promise<void> => {}, []);
  return { isCastingVote: false, castVote };
}
