import { CreateOptionsModal } from '@components/CreateOptionsModal/CreateOptionsModal';
import { useAuth } from '@domains/auth';
import { useCollapseOnScroll } from '@hooks/useCollapseOnScroll';
import { Avatar } from '@saga/global-web';
import { Calendar, Home02, Plus, User01, Users01 } from '@untitledui/icons';
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

// Wireframe clone: floating, Instagram-inspired bottom navbar (mobile). This is a
// deliberate REDESIGN, not a faithful mirror of production. The bar floats as a
// rounded pill and collapses on scroll-down via useCollapseOnScroll. Order is
// Home, Events, Create, Community, Profile, with an enlarged Create that
// protrudes above the bar by default and shrinks inline when collapsed. Icon-only
// to match the reference pill dimensions. Inbox is no longer in the bottom bar
// (it moves to the top-right header in a follow-up change). The demo AuthProvider
// drives isAuthenticated; signed-out shows Home, Events, Community, Login.
export function BottomNavbar() {
  const { isAuthenticated, userId, userName, displayName } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const collapsed = useCollapseOnScroll();

  const isHomeActive = HOME_PATHS.includes(location.pathname);
  const isCommunitiesActive = location.pathname.startsWith('/communities');
  const isEventsActive =
    location.pathname.startsWith('/events') && location.pathname !== '/events/create';
  const isProfileActive = Boolean(userName) && location.pathname.startsWith(`/profile/${userName}`);
  const isLoginRouteActive = location.pathname.startsWith('/login');
  const isCreateActive = isCreateRouteActive(location.pathname);

  const navClass = [styles.bottomNavbar, collapsed ? styles.collapsed : '']
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={navClass} aria-label="Primary">
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
          </button>

          <button
            type="button"
            className={navButtonClass(isEventsActive)}
            onClick={() => navigate('/events')}
            aria-label="Events"
            aria-current={isEventsActive ? 'page' : undefined}
          >
            <Calendar className={styles['nav-icon']} aria-hidden />
          </button>

          <button
            type="button"
            className={navButtonClass(isCommunitiesActive)}
            onClick={() => navigate('/communities')}
            aria-label="Communities"
            aria-current={isCommunitiesActive ? 'page' : undefined}
          >
            <Users01 className={styles['nav-icon']} aria-hidden />
          </button>

          <button
            type="button"
            className={navButtonClass(isLoginRouteActive)}
            onClick={() => navigate('/login')}
            aria-label="Login"
            aria-current={isLoginRouteActive ? 'page' : undefined}
          >
            <User01 className={styles['nav-icon']} aria-hidden />
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
          </button>

          <button
            type="button"
            className={navButtonClass(isEventsActive)}
            onClick={() => navigate('/events')}
            aria-label="Events"
            aria-current={isEventsActive ? 'page' : undefined}
          >
            <Calendar className={styles['nav-icon']} aria-hidden />
          </button>

          <button
            type="button"
            className={[
              styles['nav-button'],
              styles['nav-button-create'],
              isCreateActive ? styles['nav-button-selected'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => setIsCreateModalOpen(true)}
            aria-label="Create"
            aria-current={isCreateActive ? 'page' : undefined}
          >
            <span className={styles['create-fab']}>
              <Plus className={styles['create-icon']} aria-hidden />
            </span>
          </button>

          <button
            type="button"
            className={navButtonClass(isCommunitiesActive)}
            onClick={() => navigate('/communities')}
            aria-label="Communities"
            aria-current={isCommunitiesActive ? 'page' : undefined}
          >
            <Users01 className={styles['nav-icon']} aria-hidden />
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
          </button>
        </div>
      )}
      <CreateOptionsModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </nav>
  );
}
