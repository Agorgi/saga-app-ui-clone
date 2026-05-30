import { LoginSection } from '../ui/LoginSection/LoginSection';
import styles from './LoginPage.module.scss';

// Wireframe clone: route target for /login. The source renders LoginSection
// inside an AuthModal overlay; this clone has no modal infra, so the login form
// is shown as a centered standalone page.
export function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <LoginSection />
    </div>
  );
}
