import { useAuth } from '@domains/auth/context/useAuth';
import { Button, CharacterCount, Stack, toast, useTrackEvent } from '@saga/global-web';
import { useCallback, useEffect, useId, useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import styles from './ProfileEditForm.module.scss';

// Wireframe clone: the production form persists edits through `updateUserProfile`
// from `@saga/api-web`, invalidates the profile + picture caches, and refreshes
// the profile context. The clone has no backend, so the save handler just toasts
// success and closes the editor. The DOM, classNames, field constraints
// (display name maxLength 30, bio textarea rows 4 / maxLength 200), and the
// CharacterCount surface are kept verbatim so the markup matches the source.
type ProfileEditFormProps = Readonly<{
  onCancel: () => void;
  profilePictureFile?: File;
  bannerFile?: File;
  shouldRemoveBanner?: boolean;
  shouldRemoveProfilePicture?: boolean;
}>;

export function ProfileEditForm({ onCancel }: ProfileEditFormProps) {
  const { profile } = useProfile();
  const { userName: currentUserName } = useAuth();
  const { trackEvent } = useTrackEvent();

  // Form state - managed internally
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Unique IDs for form elements
  const displayNameId = useId();
  const bioId = useId();

  // Initialize form with current profile values
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setBio(profile.properties?.description || '');
    }
  }, [profile]);

  const handleSave = useCallback(async () => {
    trackEvent('profile_save', currentUserName || '');
    setIsSaving(true);
    toast.success('Profile updated successfully');
    onCancel();
    setIsSaving(false);
  }, [currentUserName, trackEvent, onCancel]);

  return (
    <Stack className="precedent-gap-md">
      <div className={styles.profile__form_field}>
        <label htmlFor={displayNameId}>Display Name</label>
        <input
          id={displayNameId}
          type="text"
          value={displayName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
          placeholder="Your display name"
          maxLength={30}
        />
      </div>
      <div className={styles.profile__form_field}>
        <label htmlFor={bioId}>Bio</label>
        <textarea
          id={bioId}
          value={bio}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          rows={4}
          maxLength={200}
        />
        <CharacterCount current={bio.length} max={200} />
      </div>
      <div className={styles.profile__edit_actions}>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    </Stack>
  );
}
