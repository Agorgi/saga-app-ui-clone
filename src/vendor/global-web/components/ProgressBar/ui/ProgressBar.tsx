import styles from './ProgressBar.module.scss';

type ProgressBarProps = {
  readonly current: number;
  readonly total: number;
  readonly ariaLabel?: string;
};

export function ProgressBar({ current, total, ariaLabel }: ProgressBarProps) {
  const safeTotal = total > 0 ? total : 1;
  const clamped = Math.min(Math.max(current, 0), safeTotal);
  const percent = Math.max(0, Math.min(100, Math.round((clamped / safeTotal) * 100)));

  return (
    <div
      className={styles.progressBar}
      role="progressbar"
      aria-label={ariaLabel ?? `Progress ${clamped} of ${safeTotal}`}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={safeTotal}
    >
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
