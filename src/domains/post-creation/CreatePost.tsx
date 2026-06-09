import { wirePosts } from '@/data/fixtures';
import { CommunitySelector } from '@components/CommunitySelector/CommunitySelector';
import { type PostCreationTab, PostForm } from '@domains/post-creation/ui/PostForm/PostForm';
import { PostingModal } from '@domains/post-creation/ui/shared/PostingModal/PostingModal';
import PostModal from '@domains/posts/ui/PostModal/PostModal';
import { useGeneratePostModalHandlers } from '@hooks/useGeneratePostModalHandlers';
import { Button, LoadingSymbol } from '@saga/global-web';
import type { PostContentUpload } from '@saga/records-middleware';
import { Plus } from '@untitledui/icons';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './CreatePost.module.scss';

function isValidTab(tab: string | null): tab is PostCreationTab {
  return tab === 'editor' || tab === 'image' || tab === 'video';
}

// Wireframe clone: single-page post composer, restyled to match the event creation
// form (title at top, content, optional "+" pills, Cancel + action row) instead of
// the previous 3-step wizard. No backend: "Post" holds a brief posting state then
// returns to the feed. The ?parentId param (a feed post's "collab" CTA) is surfaced
// as a read-only collab note.
export default function CreatePostPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modalPostId = searchParams.get('post');
  const tabParam = searchParams.get('tab');
  const parentIdParam = searchParams.get('parentId');
  const { closePostModal } = useGeneratePostModalHandlers({ preserveParams: ['parentId'] });

  const [title, setTitle] = useState('');
  const [activeTab, setActiveTab] = useState<PostCreationTab>(
    isValidTab(tabParam) ? tabParam : 'image',
  );
  const [showCommunities, setShowCommunities] = useState(false);
  const [selectedCommunityIds, setSelectedCommunityIds] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (isValidTab(tabParam)) setActiveTab(tabParam);
  }, [tabParam]);

  const parentTitle = parentIdParam
    ? wirePosts.find((post) => post.id === parentIdParam)?.title
    : undefined;

  const handlePost = useCallback(() => {
    // Wireframe: no create call fires. Hold the posting modal briefly, then feed.
    setIsPosting(true);
    window.setTimeout(() => navigate('/feed'), 900);
  }, [navigate]);

  // PostForm requires an onSubmit; the bottom action drives posting here, and the
  // section submit buttons are hidden, so this is never called.
  const handleContentSubmit = useCallback(
    async (_content: PostContentUpload, _title: string) => {},
    [],
  );

  const communitiesActive = showCommunities || selectedCommunityIds.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.section}>
          <PostForm
            title={title}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onSubmit={handleContentSubmit}
            hideSubmit
          />
        </div>

        <input
          type="text"
          className={styles.titleInput}
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Post title"
        />

        {parentTitle && <p className={styles.collabNote}>Collab on: {parentTitle}</p>}

        <div className={styles.pillRow}>
          <button
            type="button"
            className={`${styles.pill} ${communitiesActive ? styles.pillActive : ''}`}
            onClick={() => setShowCommunities((v) => !v)}
            aria-expanded={showCommunities}
          >
            <Plus className={styles.pillIcon} aria-hidden />
            Tag communities
          </button>
        </div>

        {showCommunities && (
          <div className={styles.extraInputs}>
            <CommunitySelector
              selectedCommunityIds={selectedCommunityIds}
              onSelectionChange={setSelectedCommunityIds}
              maxSelection={5}
              label=""
            />
          </div>
        )}

        <div className={styles.actions}>
          <Button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate('/')}
            disabled={isPosting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className={styles.submitButton}
            onClick={handlePost}
            disabled={isPosting}
          >
            {isPosting ? (
              <>
                <LoadingSymbol size="small" />
                Posting...
              </>
            ) : (
              'Post'
            )}
          </Button>
        </div>
      </div>

      {modalPostId && <PostModal postId={modalPostId} onClose={closePostModal} />}
      <PostingModal isVisible={isPosting} text="Creating your post..." />
    </div>
  );
}
