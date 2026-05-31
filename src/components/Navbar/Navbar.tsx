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

// Wireframe clone: the authenticated navbar reproduces the source chrome — a
// Following link, the NotificationDropdown, a CreateButton + CreateOptionsModal,
// and the Manage Communities / Settings / Log Out menu items. The source renders
// the profile glyph via ProfilePictureIcon (which fetches a real avatar); the
// clone has no avatar backend, so it keeps the design system's Avatar fed by the
// demo display name. Manage Communities and Settings route to paths outside this
// clone's scope, so they fall through to the wireframe NotFound. The demo
// AuthProvider drives isAuthenticated.
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
          <Link to="/" className={styles['navbar-logo']}>
            <img src={favicon} alt="Saga" className={styles['navbar-logo-favicon']} />
            <img
              src={theme === 'light' ? sagaTextLight : sagaText}
              alt="Saga"
              className={styles['navbar-logo-text']}
            />
          </Link>

          <div className={styles['navbar-links']}>
            <Link to="/" className={styles['navbar-link']}>
              Home
            </Link>
            <Link to="/communities" className={styles['navbar-link']}>
              Communities
            </Link>
            <Link to="/events" className={styles['navbar-link']}>
              Events
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/following-feed" className={styles['navbar-link']}>
                  Following
                </Link>
                <Link to={`/profile/${userName}`} className={styles['navbar-link']}>
                  Profile
                </Link>
              </>
            ) : null}
          </div>
        </div>

        <div className={styles['navbar-actions']}>
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <NotificationDropdown />
              <CreateButton
                onClick={() => setIsCreateModalOpen(true)}
                className={styles['navbar-create-button-hidden']}
              />
              <div className={styles['navbar-profile-wrapper']} ref={profileMenuRef}>
                <button
                  type="button"
                  className={styles['navbar-profile-button']}
                  onClick={toggleMenu}
                  aria-haspopup="menu"
                  aria-expanded={isMenuOpen}
                  aria-label="User menu"
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
            </>
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
