import styles from './ProgressWheel.module.scss';

type ProgressWheelProps = {
  readonly current: number;
  readonly total: number;
  readonly label?: string;
};

export function ProgressWheel({ current, total, label }: ProgressWheelProps) {
  const safeTotal = total > 0 ? total : 1;
  const clamped = Math.min(Math.max(current, 0), safeTotal);
  const ratio = clamped / safeTotal;
  const circumference = 2 * Math.PI * 24;
  const dash = ratio * circumference;
  const isOrange = clamped >= 3;
  const gradientId = 'progress-wheel-gradient-orange-purple';

  return (
    <div
      className={`${styles.wheel} ${isOrange ? styles.orange : ''}`}
      role="progressbar"
      aria-label={label ?? 'progress'}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={safeTotal}
    >
      <svg viewBox="0 0 64 64" className={styles.svg}>
        <title>Progress wheel</title>
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2="64"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="var(--brand-gradient-start)" />
            <stop offset="100%" stopColor="var(--brand-gradient-end)" />
          </linearGradient>
        </defs>
        <circle className={styles.track} cx="32" cy="32" r="24" />
        <circle
          className={styles.progressSolid}
          cx="32"
          cy="32"
          r="24"
          strokeDasharray={`${dash} ${circumference - dash}`}
        />
        <circle
          className={styles.progressGradient}
          cx="32"
          cy="32"
          r="24"
          stroke={`url(#${gradientId})`}
          strokeDasharray={`${dash} ${circumference - dash}`}
        />
      </svg>
      <div className={styles.center}>
        <span className={styles.count}>
          {clamped}/{safeTotal}
        </span>
      </div>
    </div>
  );
}
