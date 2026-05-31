import { useAuth } from '@domains/auth';
import { Avatar } from '@saga/global-web';
import { Calendar, Home02, User01, Users01 } from '@untitledui/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './BottomNavbar.module.scss';

const HOME_PATHS = ['/', '/feed', '/following-feed'] satisfies readonly string[];

function navButtonClass(isSelected: boolean): string {
  return [styles['nav-button'], isSelected ? styles['nav-button-selected'] : '']
    .filter(Boolean)
    .join(' ');
}

// Wireframe clone: bottom navbar (mobile). Mirrors the source component's
// !isAuthenticated / isAuthenticated split. The demo AuthProvider drives
// isAuthenticated, so signing in via /login swaps the Login tab for the
// authenticated Profile tab. The source's authenticated bar also renders
// Create (CreateOptionsModal) and Inbox (notifications) tabs; those depend on
// domains and routes outside this clone's scope, so the authenticated bar here
// is trimmed to Home + Community + Events + Profile.
export function BottomNavbar() {
  const { isAuthenticated, userId, userName, displayName } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomeActive = HOME_PATHS.includes(location.pathname);
  const isCommunitiesActive = location.pathname.startsWith('/communities');
  const isEventsActive =
    location.pathname.startsWith('/events') && location.pathname !== '/events/create';
  const isProfileActive = Boolean(userName) && location.pathname.startsWith(`/profile/${userName}`);
  const isLoginRouteActive = location.pathname.startsWith('/login');

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
    </nav>
  );
}
