import { Stack } from '@saga/global-web';
import { ProfileHeaderSection } from './sections/ProfileHeaderSection/ProfileHeaderSection';
import { ProfileTabsSection } from './sections/ProfileTabsSection/ProfileTabsSection';
import styles from './Profile.module.scss';

// Wireframe clone: profile page. The source wraps the page in a ProfileProvider
// that loads the profile by username/userId and gates loading/error/edit
// states; here it renders the header + content tabs over placeholder data.
export function ProfilePage() {
  return (
    <div className={styles.container}>
      <Stack className="precedent-gap-lg">
        <ProfileHeaderSection />
        <ProfileTabsSection />
      </Stack>
    </div>
  );
}
