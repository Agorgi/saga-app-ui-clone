import { ActionButton } from '@saga/global-web';
import type { RecordType } from '@saga/records-middleware';
import { Heart } from '@untitledui/icons';
import { useCallback, useState } from 'react';
import styles from './LikeButton.module.scss';

interface LikeButtonProps {
  recordId: string;
  userId: string | undefined;
  recordType: RecordType;
  initialLikeCount?: number;
  onLikeChange?: (liked: boolean, newCount: number) => void;
  iconClassName?: string;
  countClassName?: string;
  showLabel?: boolean;
  labelClassName?: string;
}

// Wireframe clone: the source fetches like state/count and toggles via the API
// (with optimistic updates, auth gating, tracking, and toasts). Here the toggle
// is local-only state so the icon, count, and active styling behave the same
// without any network. DOM, class names, and props match the real component.
export function LikeButton({
  recordId: _recordId,
  userId,
  recordType: _recordType,
  initialLikeCount = 0,
  onLikeChange,
  iconClassName,
  countClassName,
  showLabel = false,
  labelClassName,
}: Readonly<LikeButtonProps>) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const handleLikeToggle = useCallback(() => {
    const newLiked = !liked;
    const newCount = newLiked ? likeCount + 1 : likeCount - 1;
    setLiked(newLiked);
    setLikeCount(newCount);
    onLikeChange?.(newLiked, newCount);
  }, [liked, likeCount, onLikeChange]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleLikeToggle();
  };

  return (
    <div
      className={`${styles.likeButton} ${liked ? styles.liked : ''}`}
      title={userId === undefined ? 'Sign in to like' : undefined}
    >
      <ActionButton
        icon={
          <Heart
            className={`${styles.icon} ${liked ? styles.iconLiked : ''} ${iconClassName || ''}`}
          />
        }
        count={likeCount}
        label="Likes"
        showCount={true}
        showLabel={showLabel}
        onClick={handleClick}
        isActive={liked}
        iconClassName={iconClassName}
        countClassName={countClassName}
        labelClassName={labelClassName}
      />
    </div>
  );
}
