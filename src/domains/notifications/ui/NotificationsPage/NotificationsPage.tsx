import { Bell01 } from '@untitledui/icons';
import { Link } from 'react-router-dom';
import styles from './NotificationsPage.module.scss';

// Wireframe clone: the full-page notifications view (the mobile Inbox target).
// The source lists a live notifications feed with mark-all-read and load-more;
// the clone has no notifications backend, so it renders the source's redesigned
// empty scene (ambient backdrop + "All caught up" card). The page DOM and
// classNames match the source.
export function NotificationsPage() {
  return (
    <div className={styles['notifications-page']}>
      <div className={styles.header}>
        <h1 className={styles.title}>Notifications</h1>
        <p className={styles.subtitle}>Stay in the loop</p>
      </div>

      <section className={styles['empty-scene']} aria-label="No notifications">
        <div className={styles['empty-ambient']} aria-hidden="true" />
        <div className={styles['empty-card']}>
          <span className={styles['empty-icon-tile']} aria-hidden="true">
            <Bell01 className={styles['empty-icon']} />
          </span>
          <div className={styles['empty-copy']}>
            <h2 className={styles['empty-title']}>All caught up</h2>
            <p className={styles['empty-message']}>
              Likes, comments, follows, and event updates will show up here when they happen.
            </p>
          </div>
          <Link to="/" className={styles['empty-link']}>
            Explore the feed
          </Link>
        </div>
      </section>
    </div>
  );
}
