import { ThemeToggle, useTheme } from '@saga/global-web';
import { Link } from 'react-router-dom';
import favicon from '../../../public/favicon.png';
import sagaText from '../../../public/saga-text.svg';
import sagaTextLight from '../../../public/saga-text-light.svg';
import styles from './Navbar.module.scss';

// Wireframe clone: public, logged-out navbar. The authenticated variant
// (notifications, create, profile dropdown) is intentionally omitted — this
// clone renders the public face of the app only.
export default function Navbar() {
  const { theme } = useTheme();
  const rootBackground = {
    pathname: '/',
    search: '',
    hash: '',
    state: undefined,
    key: 'root',
  };

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
          </div>
        </div>

        <div className={styles['navbar-actions']}>
          <ThemeToggle />
          <Link
            to="/login"
            className={`${styles['navbar-auth-link']} ${styles.primary}`}
            state={{ backgroundLocation: rootBackground }}
          >
            Log In
          </Link>
        </div>
      </div>
    </nav>
  );
}
