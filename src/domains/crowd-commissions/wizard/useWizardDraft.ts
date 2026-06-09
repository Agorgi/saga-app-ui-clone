import { type Dispatch, type SetStateAction, useCallback, useEffect, useState } from 'react';

/**
 * Mirrors useState but persists the value to sessionStorage on every change.
 *
 * - Reads from sessionStorage on first render (lazy initializer) — no flash of initial state.
 * - Writes on every value change via useEffect.
 * - `serialize` is an optional transform applied *before* writing, used to strip
 *   binary data (e.g. base64 image URLs) that would bloat or exceed the 5 MB quota.
 * - Returns a `clearDraft()` function to remove the key; call this on successful submit.
 *
 * sessionStorage is intentionally used over localStorage: it survives page reloads
 * within the same tab but clears automatically when the tab is closed, preventing
 * stale draft data from surfacing in future sessions.
 */
export function useWizardDraft<T>(
  key: string,
  initial: T,
  serialize?: (val: T) => T,
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = sessionStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      const toStore = serialize ? serialize(value) : value;
      sessionStorage.setItem(key, JSON.stringify(toStore));
    } catch {
      // Quota exceeded or non-browser environment — silently skip.
    }
  }, [key, value, serialize]);

  const clearDraft = useCallback(() => {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // Non-browser environment — silently skip.
    }
  }, [key]);

  return [value, setValue, clearDraft];
}
