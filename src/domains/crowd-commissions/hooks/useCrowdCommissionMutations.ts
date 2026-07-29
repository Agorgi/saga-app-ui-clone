import type {
  CreateCrowdCommissionInput,
  CreatePledgeInput,
  CrowdCommission,
  UpdateCrowdCommissionInput,
} from '@saga/crowd-commission-middleware';
import { useCallback } from 'react';

// Wireframe clone: production wires these to @saga/api-web (create/update/publish/pledge,
// etc.) with toasts and error handling. Here every mutation is an inert no-op so the cloned
// UI renders and its loading flags stay wired without any network call or state change.
// Export names + return shapes mirror app-web's useCrowdCommissionMutations verbatim.

export function useCreateCrowdCommission() {
  const execute = useCallback(
    async (_input: CreateCrowdCommissionInput): Promise<CrowdCommission | undefined> => undefined,
    [],
  );
  return { isLoading: false, execute };
}

export function useUpdateCrowdCommission() {
  const execute = useCallback(
    async (
      _id: string,
      _input: UpdateCrowdCommissionInput,
    ): Promise<CrowdCommission | undefined> => undefined,
    [],
  );
  return { isLoading: false, execute };
}

export function useDeleteCrowdCommission() {
  const execute = useCallback(async (_id: string): Promise<boolean> => false, []);
  return { isLoading: false, execute };
}

export function usePublishCrowdCommission() {
  const execute = useCallback(
    async (_id: string): Promise<CrowdCommission | undefined> => undefined,
    [],
  );
  return { isLoading: false, execute };
}

export function useUnpublishCrowdCommission() {
  const execute = useCallback(
    async (_id: string): Promise<CrowdCommission | undefined> => undefined,
    [],
  );
  return { isLoading: false, execute };
}

export function useCrowdCommissionPledgeCheckout() {
  const execute = useCallback(async (_id: string, _input: CreatePledgeInput): Promise<void> => {
    // Inert: production redirects to a Stripe checkout session here.
  }, []);
  return { isRedirecting: false, execute };
}
