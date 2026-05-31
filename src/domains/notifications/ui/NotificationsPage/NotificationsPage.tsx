import { Bell01 } from '@untitledui/icons';
import styles from './NotificationsPage.module.scss';

// Wireframe clone: the full-page notifications view (the mobile Inbox target).
// The source lists a live notifications feed with mark-all-read and load-more;
// the clone has no notifications backend, so it renders the source's empty
// state. The page DOM and classNames match the source.
export function NotificationsPage() {
  return (
    <div className={styles['notifications-page']}>
      <div className={styles.header}>
        <h1 className={styles.title}>Notifications</h1>
      </div>

      <div className={styles['empty-state']}>
        <Bell01 className={styles['empty-icon']} />
        <span className={styles['empty-text']}>No notifications yet</span>
      </div>
    </div>
  );
}
