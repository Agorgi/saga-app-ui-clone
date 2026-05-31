import { ChevronDown, ChevronUp } from '@untitledui/icons';
import styles from './NumberInput.module.scss';

interface NumberInputProps {
  readonly id?: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly min?: number;
  readonly max?: number;
  /** Increment/decrement step. Defaults to 1. */
  readonly step?: number;
  readonly placeholder?: string;
  readonly className?: string;
  /** Show increment/decrement chevron buttons. Defaults to true. */
  readonly showChevrons?: boolean;
}

export function NumberInput({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  className,
  showChevrons = true,
}: Readonly<NumberInputProps>) {
  // Fall back to min (or 0) when the field is empty so the chevrons stay usable.
  const numeric = parseFloat(value);
  const effective = Number.isNaN(numeric) ? (min ?? 0) : numeric;

  const canDecrement = effective - step >= (min ?? -Infinity);
  const canIncrement = effective + step <= (max ?? Infinity);

  const handleDecrement = () => {
    const clamped = min !== undefined ? Math.max(min, effective - step) : effective - step;
    onChange(String(parseFloat(clamped.toFixed(10))));
  };

  const handleIncrement = () => {
    const clamped = max !== undefined ? Math.min(max, effective + step) : effective + step;
    onChange(String(parseFloat(clamped.toFixed(10))));
  };

  const wrapperClass = className ? `${styles.wrapper} ${className}` : styles.wrapper;

  return (
    <div className={wrapperClass}>
      <input
        id={id}
        type="number"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
      />
      {showChevrons && (
        <div className={styles.chevrons}>
          <button
            type="button"
            className={styles.chevronButton}
            onClick={handleIncrement}
            disabled={!canIncrement}
            aria-label="Increase value"
          >
            <ChevronUp size={12} />
          </button>
          <button
            type="button"
            className={styles.chevronButton}
            onClick={handleDecrement}
            disabled={!canDecrement}
            aria-label="Decrease value"
          >
            <ChevronDown size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
