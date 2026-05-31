import type React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { AuthContext, type AuthContextValue, type DemoUser } from './useAuth';

const STORAGE_KEY = 'saga-clone-demo-auth';

// The single placeholder identity the demo signs every visitor in as. No real
// user data — see the repo README's wireframe contract.
const DEMO_USER: DemoUser = {
  userId: 'demo-user',
  userName: 'member',
  displayName: 'Member name',
};

function readStoredUser(): DemoUser | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Partial<DemoUser>;
    if (parsed.userId && parsed.userName && parsed.displayName) {
      return parsed as DemoUser;
    }
  } catch {
    // ignore malformed/unavailable storage — fall back to logged-out
  }
  return undefined;
}

// Wireframe clone of the production AuthProvider. The real provider hydrates a
// persisted token asynchronously, refreshes it, and wires axios interceptors.
// This is a client-only SPA with no SSR, so we read the demo user synchronously
// on first render: a logged-in refresh then shows the authenticated shell
// immediately instead of flashing the logged-out chrome or bouncing guarded
// routes (e.g. /following-feed) home before hydration lands.
export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<DemoUser | undefined>(() => readStoredUser());

  const login = useCallback((_identifier: string, _password: string) => {
    // Demo: any credentials succeed. Persist so a refresh stays signed in.
    setUser(DEMO_USER);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER));
    } catch {
      // storage unavailable — session stays in memory only
    }
  }, []);

  const logout = useCallback(() => {
    setUser(undefined);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      userId: user?.userId,
      userName: user?.userName,
      displayName: user?.displayName,
      isAuthenticated: Boolean(user),
      isHydrated: true,
      login,
      logout,
    }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
