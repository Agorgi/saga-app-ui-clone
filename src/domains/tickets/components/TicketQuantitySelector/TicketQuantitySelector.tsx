import { Minus, Plus } from '@untitledui/icons';
import { useCallback } from 'react';
import styles from './TicketQuantitySelector.module.scss';

interface Props {
  readonly value: number;
  readonly onChange: (value: number) => void;
  readonly min?: number;
  readonly max: number;
}

export function TicketQuantitySelector({ value, onChange, min = 1, max }: Props) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  const handleDecrement = useCallback(() => {
    if (canDecrement) {
      onChange(value - 1);
    }
  }, [canDecrement, onChange, value]);

  const handleIncrement = useCallback(() => {
    if (canIncrement) {
      onChange(value + 1);
    }
  }, [canIncrement, onChange, value]);

  return (
    <div className={styles.selector}>
      <button
        type="button"
        className={`${styles.button} ${styles.decrementButton}`}
        onClick={handleDecrement}
        disabled={!canDecrement}
        aria-label={`Decrease quantity (currently ${value})`}
      >
        <Minus width={18} height={18} aria-hidden="true" />
      </button>
      <div className={styles.valueContainer}>
        <span className={styles.value} aria-live="polite" aria-atomic="true">
          {value}
        </span>
      </div>
      <button
        type="button"
        className={`${styles.button} ${styles.incrementButton}`}
        onClick={handleIncrement}
        disabled={!canIncrement}
        aria-label={`Increase quantity (currently ${value})`}
      >
        <Plus width={18} height={18} aria-hidden="true" />
      </button>
    </div>
  );
}
