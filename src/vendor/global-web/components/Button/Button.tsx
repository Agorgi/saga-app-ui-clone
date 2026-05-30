import type { ButtonHTMLAttributes, RefObject } from 'react';

import styles from './Button.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({
  className,
  ref,
  ...props
}: ButtonProps & { ref?: RefObject<HTMLButtonElement | null> }) => {
  const mergedClassName = className ? `${styles.button} ${className}` : styles.button;

  return <button ref={ref} className={mergedClassName} {...props} />;
};

Button.displayName = 'Button';
