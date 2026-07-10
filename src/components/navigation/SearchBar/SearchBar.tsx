import { CornerDownLeft, SearchSm } from '@untitledui/icons';
import { forwardRef, useCallback } from 'react';
import styles from './SearchBar.module.scss';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  /** When provided, wraps the input in a `<form>` and calls this with the
   *  current value on submit (Enter key or form submit button). */
  onSubmit?: (value: string) => void;
  placeholder?: string;
  'aria-label'?: string;
  className?: string;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      value,
      onChange,
      onSubmit,
      placeholder = 'Search…',
      'aria-label': ariaLabel = 'Search',
      className,
    },
    ref,
  ) => {
    const showHint = !!onSubmit && value.length > 0;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
      },
      [onChange],
    );

    const handleSubmit = useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit?.(value);
      },
      [onSubmit, value],
    );

    const inner = (
      <div className={styles.wrapper}>
        <SearchSm className={styles.icon} width={16} height={16} aria-hidden="true" />
        <input
          ref={ref}
          type="search"
          className={`${styles.input}${showHint ? ` ${styles.inputHasHint}` : ''}`}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          aria-label={ariaLabel}
          enterKeyHint={onSubmit ? 'search' : undefined}
        />
        {showHint ? (
          <span className={styles.hint} aria-hidden="true">
            <CornerDownLeft width={11} height={11} />
          </span>
        ) : null}
      </div>
    );

    if (onSubmit) {
      return (
        <form
          className={[styles.root, className].filter(Boolean).join(' ')}
          onSubmit={handleSubmit}
        >
          {inner}
        </form>
      );
    }

    return <div className={[styles.root, className].filter(Boolean).join(' ')}>{inner}</div>;
  },
);

SearchBar.displayName = 'SearchBar';
