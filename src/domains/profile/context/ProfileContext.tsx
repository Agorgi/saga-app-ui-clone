import { useAuth } from '@domains/auth/context/useAuth';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { wireProfile } from '@/data/fixtures';

// Wireframe clone: the production context fetches the profile by username/userId
// from `@saga/api-web`, derives banner + avatar CDN URLs, and tracks
// loading/error states. Here we feed a single placeholder profile from fixtures,
// keep the same context shape so consumers stay verbatim, and treat the
// signed-in demo user's handle as the "own profile" case.

export interface WireUserProfile {
  id: string;
  displayName: string;
  userName: string;
  properties?: {
    description?: string;
    profilePictureFilename?: string;
    socialLinks?: ReadonlyArray<{ url: string }>;
  };
  banner?: string;
}

export interface ProfileContextValue {
  // Profile data
  profile: WireUserProfile | undefined;
  profilePictureUrl?: string;
  bannerUrl?: string;

  // Ownership
  isOwnProfile: boolean;

  // Edit mode control
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;

  // Loading/Error states
  isLoading: boolean;
  error: string | undefined;

  // Refresh
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export interface ProfileProviderProps {
  readonly children: React.ReactNode;
  readonly username?: string;
  readonly userId?: string;
}

export function ProfileProvider({ children, username, userId: propUserId }: ProfileProviderProps) {
  const { userName: currentUserName } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const profile = useMemo<WireUserProfile>(
    () => ({
      id: propUserId ?? 'demo-user',
      displayName: wireProfile.displayName,
      userName: username ?? wireProfile.username,
      properties: { description: wireProfile.bio, socialLinks: wireProfile.socialLinks },
      banner: undefined,
    }),
    [username, propUserId],
  );

  // Own profile when no handle is in the URL or it matches the signed-in user.
  const isOwnProfile = !username || username === currentUserName;

  const refreshProfile = useCallback(async () => {}, []);

  const value: ProfileContextValue = useMemo(
    () => ({
      profile,
      profilePictureUrl: undefined,
      bannerUrl: undefined,
      isOwnProfile,
      isEditing,
      setIsEditing,
      isLoading: false,
      error: undefined,
      refreshProfile,
    }),
    [profile, isOwnProfile, isEditing, refreshProfile],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
