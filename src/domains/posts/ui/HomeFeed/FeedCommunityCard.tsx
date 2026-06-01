import type { WireCommunity } from '@/data/fixtures';
import { JoinButton } from '@domains/communities/components/JoinButton';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import styles from './FeedCommunityCard.module.scss';

export interface FeedCommunityCardProps {
  community: WireCommunity;
  isMember?: boolean;
}

// Wireframe clone: the home feed's landscape community listing. Wider-than-tall
// card with a landscape banner placeholder on the left and the community info +
// join control on the right. Like CommunityItem, the whole card is a Link with
// the join button lifted above it so the two targets don't overlap. No real
// media — the banner is a neutral placeholder glyph.
function FeedCommunityCardComponent({ community, isMember = false }: Readonly<FeedCommunityCardProps>) {
  return (
    <article className={styles.card}>
      <Link
        to={`/communities/${community.id}`}
        className={styles.cardLink}
        aria-label={`View ${community.name}`}
      />
      <div className={styles.banner}>
        <span className={styles.bannerGlyph} aria-hidden>
          👥
        </span>
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{community.name}</h3>
        <p className={styles.stats}>{community.memberCountText}</p>
        <p className={styles.description}>{community.description}</p>
      </div>
      <div className={styles.joinWrap}>
        <JoinButton isMember={isMember} />
      </div>
    </article>
  );
}

export const FeedCommunityCard = memo(FeedCommunityCardComponent);
