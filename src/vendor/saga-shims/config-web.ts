// Wireframe shim for @saga/config-web.
// The real package validates and exposes typed env vars. Here we return
// empty strings so nothing reaches out to real services in the UI clone.

export const env: Record<string, string> = new Proxy(
  {},
  {
    get: () => '',
  },
);

// Wireframe stand-in for the real package's shared constants. Only the crowd-commission
// limits the create wizard reads are provided; values mirror the production constraints
// surfaced in the UI (2 to 5 poll options, 200-char options, 100-char title).
export const constants = {
  crowdCommissions: {
    titleMaxChars: 100,
    captionMaxChars: 1000,
    platformFeeBps: 500,
    pollOptionMaxChars: 200,
    pollOptionsMin: 2,
    pollOptionsMax: 5,
    validVoteAmountsCents: [100, 200, 500],
  },
};
