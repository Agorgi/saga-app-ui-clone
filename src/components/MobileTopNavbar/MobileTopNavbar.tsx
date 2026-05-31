import { useAuth } from '@domains/auth';
import { NotificationDropdown } from '@domains/notifications';
import { useTheme } from '@saga/global-web';
import { Link, useLocation } from 'react-router-dom';
import favicon from '../../../public/favicon.png';
import sagaText from '../../../public/saga-text.svg';
import sagaTextLight from '../../../public/saga-text-light.svg';
import styles from './MobileTopNavbar.module.scss';

// Wireframe redesign (Instagram-inspired mobile top bar). This is a deliberate
// REDESIGN, not a faithful mirror of production. The Explore/Following tabs are
// removed from the header; the Saga wordmark sits top-left (taps to home) and
// the inbox (notifications) sits top-right. Shown only on the home area, where
// the feed lives — other routes keep their own chrome. The inbox renders only
// when signed in, matching the desktop Navbar.
export default function MobileTopNavbar() {
  const location = useLocation();
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();

  // Home-area routes: explore ("/" or "/feed") and following feed.
  const isHomeArea = ['/', '/feed', '/following-feed'].includes(location.pathname);
  if (!isHomeArea) return null;

  return (
    <nav className={styles.mobileNavbar} aria-label="Top">
      <div className={styles.container}>
        <Link to="/" className={styles.logo} aria-label="Saga home">
          <img src={favicon} alt="" className={styles.logoFavicon} aria-hidden />
          <img
            src={theme === 'light' ? sagaTextLight : sagaText}
            alt="Saga"
            className={styles.logoText}
          />
        </Link>

        <div className={styles.actions}>{isAuthenticated ? <NotificationDropdown /> : null}</div>
      </div>
    </nav>
  );
}
