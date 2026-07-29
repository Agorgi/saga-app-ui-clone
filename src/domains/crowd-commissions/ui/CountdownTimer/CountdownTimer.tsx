import { formatTimeLeft } from '@domains/crowd-commissions/utils/formatDeadline';
import styles from './CountdownTimer.module.scss';

interface CountdownTimerProps {
  deadlineIso: string;
  label?: string;
}

export function CountdownTimer({ deadlineIso, label }: CountdownTimerProps) {
  const timeLeftText = formatTimeLeft(deadlineIso);
  const timerClassName =
    timeLeftText === 'Ended' ? `${styles.timer} ${styles.ended}` : styles.timer;

  return (
    <span className={timerClassName}>
      {label && <span className={styles.label}>{label}: </span>}
      {timeLeftText}
    </span>
  );
}
