import { ActionButton } from '@saga/global-web';
import { Bookmark, Heart } from '@untitledui/icons';
import { CollabButton } from '../CollabButton/CollabButton';
import styles from './PostActions.module.scss';

export interface PostActionsProps {
  likeCount: number;
  saveCount?: number;
  showCollabButton?: boolean;
}

// Wireframe clone: static like / save actions plus the collab CTA. The source
// wires real toggle state + API calls; here the buttons render the same shape
// without behavior.
export function PostActions({
  likeCount,
  saveCount,
  showCollabButton = true,
}: Readonly<PostActionsProps>) {
  return (
    <div className={styles.postActions}>
      <ActionButton icon={<Heart />} count={likeCount} label="Likes" showLabel={false} />
      <ActionButton
        icon={<Bookmark />}
        count={saveCount ?? 0}
        label="Saves"
        showCount={saveCount !== undefined}
        showLabel={false}
      />
      {showCollabButton && (
        <div className={styles.collabButton}>
          <CollabButton />
        </div>
      )}
    </div>
  );
}
