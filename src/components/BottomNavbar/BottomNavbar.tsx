import { Calendar, Home02, User01, Users01 } from '@untitledui/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './BottomNavbar.module.scss';

const HOME_PATHS = ['/', '/feed', '/following-feed'] satisfies readonly string[];

function navButtonClass(isSelected: boolean): string {
  return [styles['nav-button'], isSelected ? styles['nav-button-selected'] : '']
    .filter(Boolean)
    .join(' ');
}

// Wireframe clone: public, logged-out bottom navbar (mobile). Mirrors the
// !isAuthenticated branch of the source component.
export function BottomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomeActive = HOME_PATHS.includes(location.pathname);
  const isCommunitiesActive = location.pathname.startsWith('/communities');
  const isEventsActive =
    location.pathname.startsWith('/events') && location.pathname !== '/events/create';
  const isLoginRouteActive = location.pathname.startsWith('/login');

  return (
    <nav className={styles.bottomNavbar} aria-label="Primary">
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
    </nav>
  );
}
