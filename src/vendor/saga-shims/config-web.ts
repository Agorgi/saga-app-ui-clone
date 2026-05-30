// Wireframe shim for @saga/config-web.
// The real package validates and exposes typed env vars. Here we return
// empty strings so nothing reaches out to real services in the UI clone.

export const env: Record<string, string> = new Proxy(
  {},
  {
    get: () => '',
  },
);
