import { ProfileProvider, useProfile } from '@domains/profile/context/ProfileContext';
import { ProfileEditSection } from '@domains/profile/sections/ProfileEditSection/ProfileEditSection';
import { ProfileHeaderSection } from '@domains/profile/sections/ProfileHeaderSection/ProfileHeaderSection';
import { ProfileTabsSection } from '@domains/profile/sections/ProfileTabsSection/ProfileTabsSection';
import { ProfileState } from '@domains/profile/ui/ProfileState/ProfileState';
import { Stack } from '@saga/global-web';
import { useParams } from 'react-router-dom';
import styles from './Profile.module.scss';

function ProfilePageContent() {
  const { isLoading, error, profile, isEditing } = useProfile();

  // Handle loading, error, and empty states
  if (isLoading || error || !profile) {
    return (
      <ProfileState
        isLoading={isLoading}
        error={error}
        isEmpty={!profile && !isLoading && !error}
      />
    );
  }

  return (
    <div className={styles.container}>
      <Stack className="precedent-gap-lg">
        {isEditing ? (
          <ProfileEditSection />
        ) : (
          <>
            <ProfileHeaderSection />
            <ProfileTabsSection />
          </>
        )}
      </Stack>
    </div>
  );
}

export function ProfilePage() {
  const { username, userId: paramUserId } = useParams();

  return (
    <ProfileProvider username={username} userId={paramUserId}>
      <ProfilePageContent />
    </ProfileProvider>
  );
}
