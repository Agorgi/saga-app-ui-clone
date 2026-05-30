import type { WireCommunity } from '@/data/fixtures';
import { CommunityItem } from './CommunityItem';
import styles from './CommunityList.module.scss';

export interface CommunityListProps {
  communities: WireCommunity[];
  emptyMessage?: string;
  showJoinButtons?: boolean;
}

// Wireframe clone: vertical list of community rows. Source wires infinite
// scroll + membership state; here it maps the placeholder list.
export function CommunityList({
  communities,
  emptyMessage = 'No communities found',
  showJoinButtons = true,
}: Readonly<CommunityListProps>) {
  if (communities.length === 0) {
    return <div className={styles.emptyMessage}>{emptyMessage}</div>;
  }

  return (
    <div className={styles.communitiesList}>
      {communities.map((community) => (
        <CommunityItem
          key={community.id}
          community={community}
          showJoinButton={showJoinButtons}
        />
      ))}
    </div>
  );
}
