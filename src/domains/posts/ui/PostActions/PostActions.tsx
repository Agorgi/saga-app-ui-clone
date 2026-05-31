import { useAuth } from '@domains/auth';
import { POST } from '@saga/records-middleware';
import type React from 'react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CollabButton } from '../CollabButton/CollabButton';
import { LikeButton } from '../LikeButton/LikeButton';
import { SaveButton } from '../SaveButton/SaveButton';
import styles from './PostActions.module.scss';

interface PostActionsProps {
  recordId: string;
  initialLikeCount?: number;
  initialSaveCount?: number;
  onLikeChange?: (liked: boolean, newCount: number) => void;
  onSaveChange?: (saved: boolean, newCount: number) => void;
  collabVariant?: 'full' | 'icon';
  showCollabButton?: boolean;
}

// Wireframe clone: the source fires analytics on collab click. Here we keep the
// same shape (Like + Save + optional Collab CTA) and navigate to the create-post
// flow, dropping tracking. Like/Save toggle locally inside their components.
export const PostActions: React.FC<PostActionsProps> = ({
  recordId,
  initialLikeCount = 0,
  initialSaveCount = 0,
  onLikeChange,
  onSaveChange,
  collabVariant = 'full',
  showCollabButton = false,
}) => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const handleCollabClick = useCallback(() => {
    navigate(`/create-post?parentId=${recordId}`);
  }, [recordId, navigate]);

  return (
    <div className={styles.postActions}>
      <LikeButton
        recordId={recordId}
        userId={userId}
        recordType={POST}
        initialLikeCount={initialLikeCount}
        onLikeChange={onLikeChange}
      />
      <SaveButton
        recordId={recordId}
        userId={userId}
        initialSaveCount={initialSaveCount}
        onSaveChange={onSaveChange}
      />
      {showCollabButton && (
        <div className={styles.collabButton}>
          <CollabButton onClick={handleCollabClick} variant={collabVariant} />
        </div>
      )}
    </div>
  );
};
