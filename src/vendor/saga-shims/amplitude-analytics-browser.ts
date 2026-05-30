// Wireframe shim for @amplitude/analytics-browser.
// No analytics in the UI clone — init/track are no-ops so the vendored
// amplitude.ts wrapper stays verbatim without firing real network calls.

export function init(_apiKey: string, ..._rest: unknown[]): void {}

export function track(_event: unknown, ..._rest: unknown[]): void {}
