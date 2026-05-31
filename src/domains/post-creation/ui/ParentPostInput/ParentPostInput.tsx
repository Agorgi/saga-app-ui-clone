import { useGeneratePostModalHandlers } from '@hooks/useGeneratePostModalHandlers';
import { Button, toast } from '@saga/global-web';
import type { Post } from '@saga/records-middleware';
import styles from './ParentPostInput.module.scss';

interface ParentPostInputProps {
  readonly parentPost: Post | null;
  readonly onParentPostChange: (post: Post | null) => void;
  readonly parentPostUrl: string;
  readonly onParentPostUrlChange: (url: string) => void;
  readonly readOnly?: boolean;
}

// Wireframe clone: the source validates the pasted post URL against the API
// (useParentPostValidation) and hydrates the linked post. Here "Set" just turns
// the entered text into a placeholder parent so the collab affordance renders.
// Same DOM + classNames; clicking the set parent opens the post modal.
export function ParentPostInput({
  parentPost,
  onParentPostChange,
  parentPostUrl,
  onParentPostUrlChange,
  readOnly = false,
}: ParentPostInputProps) {
  const { openPostModal } = useGeneratePostModalHandlers({
    preserveParams: ['parentId'],
  });

  const handleSetParent = () => {
    const trimmed = parentPostUrl.trim();
    if (!trimmed) {
      toast.error('Please enter a post URL');
      return;
    }

    onParentPostChange({ id: trimmed, name: trimmed });
  };

  const handleRemoveParent = () => {
    onParentPostChange(null);
    onParentPostUrlChange('');
  };

  if (parentPost) {
    return (
      <div className={styles.parentPostSet}>
        <div className={styles.parentPostInfo}>
          <span className={styles.parentPostLabel}>Collabing with:</span>
          <button
            type="button"
            onClick={() => openPostModal(parentPost.id)}
            className={styles.parentPostTitle}
          >
            {parentPost.name || 'Untitled Post'}
          </button>
        </div>
        {!readOnly && (
          <button
            type="button"
            onClick={handleRemoveParent}
            className={styles.removeParentButton}
            aria-label="Remove parent post"
          />
        )}
      </div>
    );
  }

  // If read-only and no parent post, don't show anything
  if (readOnly) {
    return null;
  }

  return (
    <div className={styles.parentUrlInputGroup}>
      <input
        type="text"
        placeholder="If this is a collab, link the original post here!"
        value={parentPostUrl}
        onChange={(e) => onParentPostUrlChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSetParent();
          }
        }}
        className={styles.parentIdInput}
      />
      <Button onClick={handleSetParent} disabled={!parentPostUrl.trim()}>
        Set
      </Button>
    </div>
  );
}
