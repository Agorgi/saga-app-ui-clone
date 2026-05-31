// Public surface of the auth domain, mirroring apps/app-web's `@domains/auth`
// barrel. Components across the app import `useAuth` from here.
export { AuthProvider } from './context/AuthContext';
export { AuthContext, useAuth } from './context/useAuth';
export type { AuthContextValue, DemoUser } from './context/useAuth';
export { LoginSection } from './ui/LoginSection/LoginSection';
