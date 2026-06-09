// Wireframe clone: production subscribes to live crowd-commission events over the shared
// SSE connection (NotificationProvider) to patch state in real time. The clone has no
// backend, so this is a no-op. The callbacks argument is accepted and ignored.
export type CrowdCommissionSSECallbacks = Record<string, ((payload: unknown) => void) | undefined>;

export function useCrowdCommissionSSE(_callbacks: unknown): void {
  // no-op
}
