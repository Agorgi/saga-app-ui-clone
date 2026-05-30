import type { ReactNode } from 'react';
import styles from './StatusMessage.module.scss';

export interface StatusMessageProps {
  type: 'error' | 'success';
  children: ReactNode;
}

export function StatusMessage({ type, children }: StatusMessageProps) {
  return <div className={`${styles.statusMessage} ${styles[type]}`}>{children}</div>;
}
