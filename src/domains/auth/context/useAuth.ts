import { createContext, useContext } from 'react';

// Wireframe clone of the auth context surface.
//
// Production exposes a richer AuthContextValue (access/refresh tokens, role,
// verification state, signup, resendVerification, ...) backed by real API calls
// and localStorage. For a UI-only demo we keep the fields the rendered screens
// actually read — identity + the login/logout actions — so consuming components
// (CreatorLink, PostActions, Navbar, LoginSection) can import `useAuth` from
// `@domains/auth` exactly like they do in the real app.
export interface DemoUser {
  userId: string;
  userName: string;
  displayName: string;
}

export interface AuthContextValue {
  userId?: string;
  userName?: string;
  displayName?: string;
  isAuthenticated: boolean;
  isHydrated: boolean;
  /**
   * Demo sign-in. Accepts any identifier/password and signs the visitor in as a
   * placeholder user. There is no real authentication in the clone.
   */
  login: (identifier: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
