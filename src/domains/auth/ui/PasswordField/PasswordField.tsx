import { FormField, type FormFieldProps } from '@saga/global-web';
import { Eye, EyeOff } from '@untitledui/icons';
import { useState } from 'react';
import styles from './PasswordField.module.scss';

export type PasswordFieldProps = Omit<FormFieldProps, 'type' | 'suffix'>;

export function PasswordField(props: Readonly<PasswordFieldProps>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      {...props}
      type={showPassword ? 'text' : 'password'}
      suffix={
        <button
          type="button"
          className={styles.passwordToggle}
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <Eye className={styles.icon} /> : <EyeOff className={styles.icon} />}
        </button>
      }
    />
  );
}
