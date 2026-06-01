import { CreateOptionsModal } from '@components/CreateOptionsModal/CreateOptionsModal';
import { useAuth } from '@domains/auth';
import { NotificationDropdown } from '@domains/notifications';
import { Avatar, CreateButton, ThemeToggle, useTheme } from '@saga/global-web';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import favicon from '../../../public/favicon.png';
import sagaText from '../../../public/saga-text.svg';
import sagaTextLight from '../../../public/saga-text-light.svg';
import styles from './Navbar.module.scss';

// Wireframe redesign (Instagram-inspired): the desktop header mirrors the mobile
// bottom bar. Same five destinations in the same order — on mobile they are icons
// in a floating footer (Home, Events, Create, Community, Profile); here they are
// text on the right, with Home represented by the Saga logo on the far left.
//
// Divergences from production, all deliberate:
// - The redundant "Home" text link is gone; the Saga wordmark (links to "/") is
//   the sole home affordance.
// - "Following" and "Explore" are dropped from the header.
// - Order on the right is Events, Create, Community, Profile. The theme toggle and
//   the notifications (inbox) icon are kept as utilities tucked beside them.
//
// Clone-specific: the source renders the profile glyph via ProfilePictureIcon
// (which fetches a real avatar); the clone has no avatar backend, so it keeps the
// design system's Avatar fed by the demo display name. Manage Communities and
// Settings route to paths outside this clone's scope and fall through to the
// wireframe NotFound. The demo AuthProvider drives isAuthenticated.
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, userId, userName, displayName } = useAuth();
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const rootBackground = {
    pathname: '/',
    search: '',
    hash: '',
    state: undefined,
    key: 'root',
  };

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/', { state: { backgroundLocation: rootBackground } });
  };

  const handleManageCommunities = () => {
    navigate('/manage-communities', {
      state: { backgroundLocation: location },
    });
    closeMenu();
  };

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const wrapper = profileMenuRef.current;
      if (wrapper && !wrapper.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, closeMenu]);

  useEffect(() => {
    if (!isAuthenticated) {
      closeMenu();
    }
  }, [isAuthenticated, closeMenu]);

  return (
    <nav className={styles.navbar}>
      <div className={styles['navbar-container']}>
        <div className={styles['navbar-left']}>
          <Link to="/" className={styles['navbar-logo']} aria-label="Saga home">
            <img src={favicon} alt="" className={styles['navbar-logo-favicon']} aria-hidden />
            <img
              src={theme === 'light' ? sagaTextLight : sagaText}
              alt="Saga"
              className={styles['navbar-logo-text']}
            />
          </Link>

          <div className={styles['navbar-links']}>
            <Link to="/events" className={styles['navbar-link']}>
              Events
            </Link>

            {isAuthenticated ? (
              <CreateButton onClick={() => setIsCreateModalOpen(true)} />
            ) : null}

            <Link to="/communities" className={styles['navbar-link']}>
              Community
            </Link>
          </div>
        </div>

        <div className={styles['navbar-actions']}>
          {isAuthenticated ? <NotificationDropdown /> : null}
          <ThemeToggle />

          {isAuthenticated ? (
            <div className={styles['navbar-profile-wrapper']} ref={profileMenuRef}>
              <button
                type="button"
                className={styles['navbar-profile-button']}
                onClick={toggleMenu}
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
                aria-label="Profile"
              >
                {userId && (
                  <Avatar
                    name={displayName ?? 'Member'}
                    userId={userId}
                    type="user"
                    variant="medium"
                    className={styles.profileImage}
                  />
                )}
              </button>
              {isMenuOpen ? (
                <div className={styles['navbar-dropdown']} role="menu">
                  <Link
                    to={`/profile/${userName}`}
                    className={styles['navbar-dropdown-item']}
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    View Profile
                  </Link>
                  <button
                    type="button"
                    className={styles['navbar-dropdown-item']}
                    role="menuitem"
                    onClick={handleManageCommunities}
                  >
                    Manage Communities
                  </button>
                  <Link
                    to="/settings"
                    className={styles['navbar-dropdown-item']}
                    role="menuitem"
                    onClick={closeMenu}
                  >
                    Settings
                  </Link>
                  <button
                    type="button"
                    className={styles['navbar-dropdown-item']}
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              to="/login"
              className={`${styles['navbar-auth-link']} ${styles.primary}`}
              state={{ backgroundLocation: rootBackground }}
            >
              Log In
            </Link>
          )}
        </div>
      </div>
      <CreateOptionsModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </nav>
  );
}
