import { wireCommissions } from '@/data/fixtures';
import type { CrowdCommission } from '@saga/crowd-commission-middleware';
import { useCallback } from 'react';

export interface UseCrowdCommissionResult {
  commission: CrowdCommission | undefined;
  loading: boolean;
  error: string | undefined;
  refetch: () => Promise<void>;
}

// Wireframe clone: production fetches a single commission by id from the API. Here we
// resolve it from the placeholder fixtures so a post's commission badge can open the
// matching detail sheet (or poll modal) with no backend.
export function useCrowdCommission(id: string): UseCrowdCommissionResult {
  const refetch = useCallback(async (): Promise<void> => {}, []);
  const commission = wireCommissions.find((c) => c.id === id);
  return { commission, loading: false, error: undefined, refetch };
}
