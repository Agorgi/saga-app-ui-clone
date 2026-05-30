import { Card } from '@saga/global-web';
import type { ReactNode } from 'react';
import styles from '../../styles/authSections.module.scss';

interface AuthPageLayoutProps {
  title: string;
  description: string;
  footer?: ReactNode;
  statusMessages?: ReactNode;
  children: ReactNode;
}

export function AuthPageLayout({
  title,
  description,
  footer,
  statusMessages,
  children,
}: Readonly<AuthPageLayoutProps>) {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      {statusMessages}

      <Card className={styles.card}>{children}</Card>

      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </div>
  );
}
