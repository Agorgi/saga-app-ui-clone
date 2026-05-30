// Wireframe shim for @openfeature/react-sdk.
// Avatar uses useNumberFlagValue to pick a deterministic color index from a
// feature flag. With no flag backend we just echo the provided default.

export function useNumberFlagValue(_flagKey: string, defaultValue: number): number {
  return defaultValue;
}
