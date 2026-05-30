import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './FormField.module.scss';

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  required?: boolean;
  helpText?: string;
  errorText?: string;
  showRequiredIndicator?: boolean;
  suffix?: ReactNode;
}

export function FormField({
  label,
  id,
  required,
  helpText,
  errorText,
  showRequiredIndicator,
  suffix,
  type,
  ...inputProps
}: FormFieldProps) {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id}>
        {label}
        {showRequiredIndicator ? <span className={styles.required}>*</span> : null}
      </label>
      <div className={styles.inputWrapper}>
        <input id={id} required={required} type={type} {...inputProps} />
        {suffix}
      </div>
      {helpText ? <p className={styles.fieldHelp}>{helpText}</p> : null}
      {errorText ? <p className={styles.fieldError}>{errorText}</p> : null}
    </div>
  );
}
