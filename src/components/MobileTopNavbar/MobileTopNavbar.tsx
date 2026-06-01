import { useAuth } from '@domains/auth';
import { NotificationDropdown } from '@domains/notifications';
import { useLocation } from 'react-router-dom';
import styles from './MobileTopNavbar.module.scss';

// Wireframe redesign (Instagram-inspired). This is a deliberate REDESIGN, not a
// faithful mirror of production. The Explore/Following home tabs are removed from
// the header entirely; the mobile header is now just the notifications (inbox)
// icon in the top-right corner. Home navigation lives in the bottom bar's Home
// icon, so the header carries no wordmark or tabs. Scoped to the home area where
// the feed lives — other routes keep their own chrome. The icon renders only when
// signed in, matching the desktop Navbar.
export default function MobileTopNavbar() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Home-area routes: explore ("/" or "/feed") and following feed.
  const isHomeArea = ['/', '/feed', '/following-feed'].includes(location.pathname);
  if (!isHomeArea) return null;

  return (
    <nav className={styles.mobileNavbar} aria-label="Top">
      <div className={styles.container}>
        <div className={styles.actions}>{isAuthenticated ? <NotificationDropdown /> : null}</div>
      </div>
    </nav>
  );
}
