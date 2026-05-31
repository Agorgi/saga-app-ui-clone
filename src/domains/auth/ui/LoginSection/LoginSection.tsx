import { Button, FormField, Stack } from '@saga/global-web';
import { type FormEvent, useId, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import styles from '../../styles/authSections.module.scss';
import { AuthPageLayout } from '../AuthPageLayout/AuthPageLayout';
import { PasswordField } from '../PasswordField/PasswordField';

// Wireframe clone: login form. The source wires real authentication (useAuth →
// login, email-verification redirect, error handling) and links to /signup and
// /forgot-password. Here the demo login accepts any email/password, signs the
// visitor in via the demo AuthProvider, and redirects into the app. The
// secondary links (sign up, forgot password) are non-navigating placeholders.
export function LoginSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = (location.state as { from?: string } | null)?.from ?? '/feed';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const identifierId = useId();
  const passwordId = useId();

  // Demo auth: any email/password succeeds. Mirrors the production submit shape
  // (preventDefault → login → navigate) without real API calls or error states.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(identifier, password);
    navigate(from, { replace: true });
  };

  return (
    <AuthPageLayout
      title="Welcome back"
      description="Sign in to continue to Saga."
      footer={
        <>
          New to Saga?{' '}
          {/* biome-ignore lint/a11y/useValidAnchor: inert wireframe link */}
          <a>Sign up now</a>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <Stack className="precedent-gap-md">
          <FormField
            label="Email or Username"
            id={identifierId}
            name="identifier"
            type="text"
            autoComplete="username"
            placeholder="you@example.com or your-username"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            required
          />

          <PasswordField
            label="Password"
            id={passwordId}
            name="password"
            autoComplete="current-password"
            placeholder="********"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              fontSize: '0.9rem',
            }}
          >
            {/* biome-ignore lint/a11y/useValidAnchor: inert wireframe link */}
            <a style={{ color: 'var(--precedent-color-primary)' }}>Forgot password?</a>
          </div>

          <div className={styles.actions}>
            <Button type="submit">Sign In</Button>
          </div>
        </Stack>
      </form>
    </AuthPageLayout>
  );
}
