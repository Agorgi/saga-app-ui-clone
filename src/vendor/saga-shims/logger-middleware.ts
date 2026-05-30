// Wireframe shim for @saga/logger-middleware.
// The real package is a structured logger; here it is a no-op so the
// vendored global-web components stay verbatim without dragging in the
// backend logging stack.

type LogFn = (...args: unknown[]) => void;

export const logger: {
  debug: LogFn;
  info: LogFn;
  warn: LogFn;
  error: LogFn;
} = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};
