import type { WireCommunity } from '@/data/fixtures';
import { Avatar } from '@saga/global-web';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import styles from './CommunityItem.module.scss';
import { JoinButton } from './JoinButton';

export interface CommunityItemProps {
  community: WireCommunity;
  isMember?: boolean;
  showJoinButton?: boolean;
}

// Wireframe clone: a single community row. Source navigates via a transparent
// overlay button; here the whole row is a Link to the community detail page.
export const CommunityItem = memo(
  ({ community, isMember = false, showJoinButton = true }: CommunityItemProps) => {
    return (
      <article className={styles.communityItem}>
        <Link
          to={`/communities/${community.id}`}
          className={styles.communityItemBackground}
          aria-label={`View ${community.name}`}
        />
        <div className={styles.thumbnailContainer}>
          <Avatar name={community.name} type="community" variant="community-small" />
        </div>
        <div className={styles.communityInfo}>
          <h3 className={styles.communityName}>{community.name}</h3>
          <p className={styles.communityDescription}>{community.description}</p>
          <p className={styles.communityStats}>{community.memberCountText}</p>
        </div>
        {showJoinButton && (
          <div className={styles.joinButtonContainer}>
            <JoinButton isMember={isMember} />
          </div>
        )}
      </article>
    );
  },
);
