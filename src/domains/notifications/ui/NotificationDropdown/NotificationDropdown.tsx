import { Bell01 } from '@untitledui/icons';
import { useEffect, useRef, useState } from 'react';
import styles from './NotificationDropdown.module.scss';

// Wireframe clone: the source wires a live notifications feed (useNotifications,
// NotificationItem, unread badge, mark-all-read, infinite scroll). The clone has
// no notifications backend, so the bell trigger and its open/close behaviour are
// kept, the unread badge is dropped, and the panel always renders the source's
// empty state. The DOM and classNames match the source.
export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles['notification-wrapper']} ref={dropdownRef}>
      <button
        type="button"
        className={styles['notification-button']}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Bell01 className={styles['notification-icon']} />
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu">
          <div className={styles['dropdown-header']}>
            <h3 className={styles['dropdown-title']}>Notifications</h3>
          </div>

          <div className={styles['dropdown-content']}>
            <div className={styles['empty-state']}>
              <span className={styles['empty-icon-tile']} aria-hidden="true">
                <Bell01 className={styles['empty-icon']} />
              </span>
              <span className={styles['empty-text']}>No notifications yet</span>
              <span className={styles['empty-hint']}>You&apos;re all caught up</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
