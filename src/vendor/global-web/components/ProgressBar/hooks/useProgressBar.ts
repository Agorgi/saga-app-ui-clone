import { useCallback, useState } from 'react';

type UseProgressBarOptions = {
  readonly initial?: number;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function useProgressBar({
  initial = 0,
  min = 0,
  max = 100,
  step = 10,
}: UseProgressBarOptions = {}) {
  const [progress, setProgress] = useState(() => clamp(initial, min, max));

  const set = useCallback(
    (value: number) => {
      setProgress(clamp(value, min, max));
    },
    [min, max],
  );

  const increment = useCallback(
    (delta: number = step) => {
      setProgress((prev) => clamp(prev + delta, min, max));
    },
    [min, max, step],
  );

  const decrement = useCallback(
    (delta: number = step) => {
      setProgress((prev) => clamp(prev - delta, min, max));
    },
    [min, max, step],
  );

  return { progress, set, increment, decrement };
}

export default useProgressBar;
