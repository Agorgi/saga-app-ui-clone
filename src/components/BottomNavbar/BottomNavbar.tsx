import { CreateOptionsModal } from '@components/CreateOptionsModal/CreateOptionsModal';
import { useAuth } from '@domains/auth';
import { Avatar } from '@saga/global-web';
import { Bell01, Calendar, Home02, PlusCircle, User01, Users01 } from '@untitledui/icons';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './BottomNavbar.module.scss';

const HOME_PATHS = ['/', '/feed', '/following-feed'] satisfies readonly string[];

function isCreateRouteActive(pathname: string): boolean {
  return (
    pathname === '/create-post' ||
    pathname === '/create-community' ||
    pathname === '/events/create' ||
    pathname === '/crowd-commissions/new'
  );
}

function navButtonClass(isSelected: boolean): string {
  return [styles['nav-button'], isSelected ? styles['nav-button-selected'] : '']
    .filter(Boolean)
    .join(' ');
}

// Wireframe clone: bottom navbar (mobile). Mirrors the source component's
// !isAuthenticated / isAuthenticated split. The demo AuthProvider drives
// isAuthenticated, so signing in via /login swaps the Login tab for the
// authenticated Home + Community + Events + Create + Inbox + Profile bar. The
// source renders the profile glyph via ProfilePictureIcon (real avatar fetch)
// and carries a live unread badge on Inbox; the clone has no avatar/notifications
// backend, so it keeps the design system's Avatar and drops the badge. Create
// opens the CreateOptionsModal; Inbox routes to /notifications.
export function BottomNavbar() {
  const { isAuthenticated, userId, userName, displayName } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const isHomeActive = HOME_PATHS.includes(location.pathname);
  const isCommunitiesActive = location.pathname.startsWith('/communities');
  const isEventsActive =
    location.pathname.startsWith('/events') && location.pathname !== '/events/create';
  const isNotificationsActive = location.pathname.startsWith('/notifications');
  const isProfileActive = Boolean(userName) && location.pathname.startsWith(`/profile/${userName}`);
  const isLoginRouteActive = location.pathname.startsWith('/login');
  const isCreateActive = isCreateRouteActive(location.pathname);

  return (
    <nav className={styles.bottomNavbar} aria-label="Primary">
      {!isAuthenticated ? (
        <div className={styles['navbar-container']}>
          <button
            type="button"
            className={navButtonClass(isHomeActive)}
            onClick={() => navigate('/')}
            aria-label="Home"
            aria-current={isHomeActive ? 'page' : undefined}
          >
            <Home02 className={styles['nav-icon']} aria-hidden />
            <span className={styles['nav-label']}>Home</span>
          </button>

          <button
            type="button"
            className={navButtonClass(isCommunitiesActive)}
            onClick={() => navigate('/communities')}
            aria-label="Communities"
            aria-current={isCommunitiesActive ? 'page' : undefined}
          >
            <Users01 className={styles['nav-icon']} aria-hidden />
            <span className={styles['nav-label']}>Community</span>
          </button>

          <button
            type="button"
            className={navButtonClass(isEventsActive)}
            onClick={() => navigate('/events')}
            aria-label="Events"
            aria-current={isEventsActive ? 'page' : undefined}
          >
            <Calendar className={styles['nav-icon']} aria-hidden />
            <span className={styles['nav-label']}>Events</span>
          </button>

          <button
            type="button"
            className={navButtonClass(isLoginRouteActive)}
            onClick={() => navigate('/login')}
            aria-label="Login"
            aria-current={isLoginRouteActive ? 'page' : undefined}
          >
            <User01 className={styles['nav-icon']} aria-hidden />
            <span className={styles['nav-label']}>Login</span>
          </button>
        </div>
      ) : (
        <div className={styles['navbar-container']}>
          <button
            type="button"
            className={navButtonClass(isHomeActive)}
            onClick={() => navigate('/')}
            aria-label="Home"
            aria-current={isHomeActive ? 'page' : undefined}
          >
            <Home02 className={styles['nav-icon']} aria-hidden />
            <span className={styles['nav-label']}>Home</span>
          </button>

          <button
            type="button"
            className={navButtonClass(isCommunitiesActive)}
            onClick={() => navigate('/communities')}
            aria-label="Communities"
            aria-current={isCommunitiesActive ? 'page' : undefined}
          >
            <Users01 className={styles['nav-icon']} aria-hidden />
            <span className={styles['nav-label']}>Community</span>
          </button>

          <button
            type="button"
            className={navButtonClass(isEventsActive)}
            onClick={() => navigate('/events')}
            aria-label="Events"
            aria-current={isEventsActive ? 'page' : undefined}
          >
            <Calendar className={styles['nav-icon']} aria-hidden />
            <span className={styles['nav-label']}>Events</span>
          </button>

          <button
            type="button"
            className={navButtonClass(isCreateActive)}
            onClick={() => setIsCreateModalOpen(true)}
            aria-label="Create"
            aria-current={isCreateActive ? 'page' : undefined}
          >
            <PlusCircle className={styles['nav-icon']} aria-hidden />
            <span className={styles['nav-label']}>Create</span>
          </button>

          <button
            type="button"
            className={`${navButtonClass(isNotificationsActive)} ${styles['notification-button']}`}
            onClick={() => navigate('/notifications')}
            aria-label="Notifications"
            aria-current={isNotificationsActive ? 'page' : undefined}
          >
            <Bell01 className={styles['nav-icon']} aria-hidden />
            <span className={styles['nav-label']}>Inbox</span>
          </button>

          <button
            type="button"
            className={navButtonClass(isProfileActive)}
            onClick={() => navigate(`/profile/${userName}`)}
            aria-label="Profile"
            aria-current={isProfileActive ? 'page' : undefined}
          >
            {userId ? (
              <Avatar
                name={displayName ?? 'Member'}
                userId={userId}
                type="user"
                variant="medium"
                className={styles['profile-icon']}
              />
            ) : null}
            <span className={styles['nav-label']}>Profile</span>
          </button>
        </div>
      )}
      <CreateOptionsModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </nav>
  );
}
