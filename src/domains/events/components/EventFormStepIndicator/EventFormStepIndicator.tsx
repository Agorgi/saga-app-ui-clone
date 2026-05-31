import { BackButton } from '@components/BackButton/BackButton';
import { useEffect, useRef } from 'react';
import styles from '../../styles/eventForm.module.scss';

interface EventFormStepIndicatorProps {
  /** Labels for each step, in order. Length determines total step count. */
  readonly stepLabels: readonly string[];
  /** 1-based current step index. */
  readonly step: number;
  readonly title: string;
  readonly subtitle: string;
  /** When provided, a back button is shown for any step after the first. */
  readonly onBack?: () => void;
  readonly isSubmitting?: boolean;
}

export function EventFormStepIndicator({
  stepLabels,
  step,
  title,
  subtitle,
  onBack,
  isSubmitting = false,
}: Readonly<EventFormStepIndicatorProps>) {
  const totalSteps = stepLabels.length;
  const progressPercent = totalSteps > 1 ? ((step - 1) / (totalSteps - 1)) * 100 : 0;
  const titleRef = useRef<HTMLHeadingElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `step` is the intentional re-focus trigger for a11y; the body only touches the stable `titleRef`.
  useEffect(() => {
    titleRef.current?.focus();
  }, [step]);

  return (
    <header className={styles.header}>
      <ol className={styles.stepIndicator} aria-label={`Step ${step} of ${totalSteps}`}>
        {stepLabels.map((label, i) => {
          const s = i + 1;
          const isActive = step === s;
          return (
            <li
              key={label}
              className={styles.stepItem}
              aria-current={isActive ? 'step' : undefined}
            >
              <div
                className={isActive ? `${styles.stepDot} ${styles.stepDotActive}` : styles.stepDot}
                aria-hidden="true"
              >
                {s}
              </div>
              <span
                className={
                  isActive ? `${styles.stepLabel} ${styles.stepLabelActive}` : styles.stepLabel
                }
              >
                {label}
              </span>
            </li>
          );
        })}
        <div
          className={styles.stepProgress}
          style={{ width: `${progressPercent}%` }}
          aria-hidden="true"
        />
      </ol>

      {step > 1 && onBack && <BackButton onClick={onBack} disabled={isSubmitting} />}

      <h1 ref={titleRef} tabIndex={-1} aria-live="polite">
        {title}
      </h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </header>
  );
}
