import type { PollResultsResponse } from '@saga/crowd-commission-middleware';
import { useCallback } from 'react';

interface UsePollResults {
  data: PollResultsResponse | undefined;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

// Wireframe clone: production fetches live poll tallies + the viewer's own vote by id and
// re-fetches on SSE events. The clone has no backend, so this returns no live data and the
// poll card falls back to the commission's own pollOptions (from fixtures).
export function usePollResults(_commissionId: string): UsePollResults {
  const refetch = useCallback(async (): Promise<void> => {}, []);
  return { data: undefined, isLoading: false, refetch };
}
