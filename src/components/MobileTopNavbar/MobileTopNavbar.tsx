import { useLocation, useNavigate } from 'react-router-dom';
import { ExploreTabWithDropdown } from './ExploreTabWithDropdown';
import styles from './MobileTopNavbar.module.scss';

// Wireframe clone: public, logged-out mobile top navbar. Logged-out users see
// a single "Explore" tab (no "Following"), so we render the single-tab variant.
export default function MobileTopNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Home-area routes: explore ("/" or "/feed") and following feed
  const isHomeArea = ['/', '/feed', '/following-feed'].includes(location.pathname);

  // Hide the mobile top navbar entirely on other pages
  if (!isHomeArea) return null;

  return (
    <nav className={styles.mobileNavbar}>
      <div className={styles.container}>
        <div className={styles.leftPlaceholder} aria-hidden="true" />

        <div
          className={[styles.tabs, styles.single].filter(Boolean).join(' ')}
          role="tablist"
          aria-label="Home tabs"
        >
          <div className={styles.track} aria-hidden="true">
            <div className={styles.indicator} />
          </div>
          <ExploreTabWithDropdown isActive={true} onClick={() => navigate('/')} />
        </div>
      </div>
    </nav>
  );
}
