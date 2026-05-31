import { useAuth } from '@domains/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { ExploreTabWithDropdown } from './ExploreTabWithDropdown';
import styles from './MobileTopNavbar.module.scss';

// Wireframe clone: mobile top navbar. Logged-out users see a single "Explore"
// tab; the demo AuthProvider flips on a second "Following" tab once signed in.
// The source persists the last-used home tab via HomeTabsContext; the clone has
// no such context, so the tab buttons navigate directly without persistence.
export default function MobileTopNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Home-area routes: explore ("/" or "/feed") and following feed
  const isHomeArea = ['/', '/feed', '/following-feed'].includes(location.pathname);
  const { isAuthenticated } = useAuth();
  const showFollowingTab = Boolean(isAuthenticated);
  const singleTab = !showFollowingTab;

  // Hide the mobile top navbar entirely on other pages
  if (!isHomeArea) return null;
  const isFollowing = location.pathname === '/following-feed';

  return (
    <nav className={styles.mobileNavbar}>
      <div className={styles.container}>
        <div className={styles.leftPlaceholder} aria-hidden="true" />

        <div
          className={[
            styles.tabs,
            isFollowing && showFollowingTab ? styles.following : '',
            singleTab ? styles.single : '',
          ]
            .filter(Boolean)
            .join(' ')}
          role="tablist"
          aria-label="Home tabs"
        >
          <div className={styles.track} aria-hidden="true">
            <div className={styles.indicator} />
          </div>
          <ExploreTabWithDropdown isActive={!isFollowing} onClick={() => navigate('/')} />
          {showFollowingTab && (
            <button
              type="button"
              className={`${styles.tab} ${isFollowing ? styles.active : ''}`}
              onClick={() => navigate('/following-feed')}
              aria-selected={isFollowing}
              role="tab"
            >
              Following
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
