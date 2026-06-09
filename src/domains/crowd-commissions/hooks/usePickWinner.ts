import { useCallback } from 'react';

// Wireframe clone: production lets the creator pick the winning poll option (which kicks
// off completion). Inert here; no network and the optional success callback is not invoked.
export function usePickWinner(_commissionId: string, _onSuccess?: () => void) {
  const pickWinner = useCallback(async (_optionId: string): Promise<void> => {}, []);
  return { isLoading: false, pickWinner };
}
