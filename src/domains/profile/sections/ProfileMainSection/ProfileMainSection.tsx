import { ProfileTabsSection } from '@domains/profile/sections/ProfileTabsSection/ProfileTabsSection';
import { Settings01 } from '@untitledui/icons';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import styles from './ProfileBannerSection.module.scss';

// Wireframe clone: the redesigned profile banner (theme-aware placeholder, no
// real media) with an owner-only settings button, and the content column that
// holds the existing tabs.
export function ProfileBannerSection() {
  const { bannerUrl, isOwnProfile } = useProfile();
  const navigate = useNavigate();
  const handleSettingsClick = useCallback(() => navigate('/settings'), [navigate]);

  return (
    <div className={styles.bannerWrap}>
      <div className={styles.bannerClip}>
        {bannerUrl ? (
          <img src={bannerUrl} alt="" className={styles.banner} draggable={false} />
        ) : (
          <div className={styles.bannerPlaceholder} aria-hidden="true" />
        )}
        <div className={styles.bannerScrim} aria-hidden="true" />
      </div>

      {isOwnProfile ? (
        <div className={styles.bannerControls}>
          <button
            type="button"
            className={styles.settingsButton}
            onClick={handleSettingsClick}
            aria-label="Settings"
            title="Settings"
          >
            <Settings01 className={styles.settingsIcon} aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function ProfileContentSection() {
  return (
    <div className={styles.contentArea}>
      <ProfileTabsSection />
    </div>
  );
}
