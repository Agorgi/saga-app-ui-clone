import { wirePosts } from '@/data/fixtures';
import { BackButton } from '@components/BackButton/BackButton';
import { CommunitySelector } from '@components/CommunitySelector/CommunitySelector';
import type { PostCreationTab } from '@domains/post-creation/ui/PostForm/PostForm';
import { PostForm } from '@domains/post-creation/ui/PostForm/PostForm';
import { PostHeaderSection } from '@domains/post-creation/ui/PostHeaderSection/PostHeaderSection';
import { PostingModal } from '@domains/post-creation/ui/shared/PostingModal/PostingModal';
import PostModal from '@domains/posts/ui/PostModal/PostModal';
import { useGeneratePostModalHandlers } from '@hooks/useGeneratePostModalHandlers';
import { Button } from '@saga/global-web';
import type { Post, PostContentUpload } from '@saga/records-middleware';
import { Check } from '@untitledui/icons';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './CreatePost.module.scss';

type WizardStep = 1 | 2 | 3;

function isValidTab(tab: string | null): tab is PostCreationTab {
  return tab === 'editor' || tab === 'image' || tab === 'video';
}

interface StepMeta {
  id: WizardStep;
  label: string;
  title: string;
  subtitle: string;
}

const STEPS: readonly [StepMeta, StepMeta, StepMeta] = [
  {
    id: 1,
    label: 'Content',
    title: 'Create your content',
    subtitle: 'Upload an image or video, or write a text post.',
  },
  {
    id: 2,
    label: 'Details',
    title: 'Title your post',
    subtitle: 'A clear title helps people find and engage with your work.',
  },
  {
    id: 3,
    label: 'Communities',
    title: 'Choose communities',
    subtitle: 'Share to up to 5 communities to reach the right audience.',
  },
];

function stepMeta(step: WizardStep): StepMeta {
  const index = step - 1;
  const meta = STEPS[index];
  if (meta === undefined) {
    throw new Error(`Invalid wizard step: ${step}`);
  }
  return meta;
}

function stepCircleMod(stepId: WizardStep, current: WizardStep): string {
  if (current === stepId) return styles['stepCircle--active'] ?? '';
  if (current > stepId) return styles['stepCircle--done'] ?? '';
  return '';
}

// Wireframe clone: copied near-verbatim from the source's CreatePostPage. The
// three-step wizard (content → details → communities) and all classNames are
// preserved. What's dropped: the real create-post mutation (useCreatePost),
// feature-flag tab default, and location-state community/event scoping. "Post"
// shows the posting modal briefly, then returns to the feed — no network. The
// `parentId` search param (set by a feed post's "collab" CTA) prefills the
// parent post from fixtures so the collab affordance renders on step 2.
export default function CreatePostPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modalPostId = searchParams.get('post');
  const tabParam = searchParams.get('tab');
  const parentIdParam = searchParams.get('parentId');
  const { closePostModal } = useGeneratePostModalHandlers({
    preserveParams: ['parentId'],
  });

  const [step, setStep] = useState<WizardStep>(1);
  const [capturedContent, setCapturedContent] = useState<PostContentUpload | null>(null);
  const [title, setTitle] = useState('');
  const [parentPost, setParentPost] = useState<Post | null>(() => {
    if (!parentIdParam) return null;
    const match = wirePosts.find((post) => post.id === parentIdParam);
    return match ? { id: match.id, name: match.title } : null;
  });
  const [parentPostUrl, setParentPostUrl] = useState('');
  const [selectedCommunityIds, setSelectedCommunityIds] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  const [activeTab, setActiveTab] = useState<PostCreationTab>(
    isValidTab(tabParam) ? tabParam : 'image',
  );

  useEffect(() => {
    if (isValidTab(tabParam)) setActiveTab(tabParam);
  }, [tabParam]);

  const captureContent = useCallback(async (content: PostContentUpload) => {
    setCapturedContent(content);
    setStep(2);
  }, []);

  const postNow = useCallback(async () => {
    if (!capturedContent) return;
    setIsPosting(true);
    // Wireframe: no create call fires. Hold the posting modal briefly, then
    // return to the feed (the source persists the post and redirects there).
    window.setTimeout(() => {
      navigate('/feed');
    }, 900);
  }, [capturedContent, navigate]);

  const canGoNextFromStep2 = title.trim().length > 0;

  return (
    <div className={styles.wizard}>
      <nav className={styles.stepIndicator} aria-label="Post creation steps">
        {STEPS.map(({ id, label }, index) => (
          <div key={id} className={styles.stepIndicatorItem}>
            <div
              className={`${styles.stepCircle} ${stepCircleMod(id, step)}`}
              aria-current={step === id ? 'step' : undefined}
            >
              {step > id ? <Check width={12} height={12} aria-hidden="true" /> : id}
            </div>
            <span
              className={`${styles.stepLabel} ${step === id ? styles['stepLabel--active'] : ''}`}
            >
              {label}
            </span>
            {index < STEPS.length - 1 && (
              <div
                className={`${styles.stepConnector} ${step > id ? styles['stepConnector--done'] : ''}`}
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </nav>

      <div className={step === 1 ? styles.stepContent : styles.stepHidden} aria-hidden={step !== 1}>
        <div className={styles.stepHeader}>
          <h2 className={styles.stepTitle}>{stepMeta(1).title}</h2>
          <p className={styles.stepSubtitle}>{stepMeta(1).subtitle}</p>
        </div>
        <PostForm
          title=""
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSubmit={(content) => captureContent(content)}
          wizardMode
        />
        <div className={styles.stepNav}>
          <div className={styles.stepNavLeft}>
            <Button
              className={`${styles.btnPill} ${styles.btnCancel}`}
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {step === 2 && (
        <div className={styles.stepContent}>
          <BackButton onClick={() => setStep(1)} />
          <div className={styles.stepHeader}>
            <h2 className={styles.stepTitle}>{stepMeta(2).title}</h2>
            <p className={styles.stepSubtitle}>{stepMeta(2).subtitle}</p>
          </div>
          <PostHeaderSection
            title={title}
            onTitleChange={setTitle}
            parentPost={parentPost}
            onParentPostChange={setParentPost}
            parentPostUrl={parentPostUrl}
            onParentPostUrlChange={setParentPostUrl}
          />
          <StepNav
            onCancel={() => navigate('/')}
            onNext={() => setStep(3)}
            nextDisabled={!canGoNextFromStep2}
            nextLabel="Next"
          />
        </div>
      )}

      {step === 3 && (
        <div className={styles.stepContent}>
          <BackButton onClick={() => setStep(2)} />
          <div className={styles.stepHeader}>
            <h2 className={styles.stepTitle}>{stepMeta(3).title}</h2>
            <p className={styles.stepSubtitle}>{stepMeta(3).subtitle}</p>
          </div>
          <CommunitySelector
            selectedCommunityIds={selectedCommunityIds}
            onSelectionChange={setSelectedCommunityIds}
            maxSelection={5}
          />
          <StepNav onCancel={() => navigate('/')} onNext={postNow} nextLabel="Post" />
        </div>
      )}

      {modalPostId && <PostModal postId={modalPostId} onClose={closePostModal} />}
      <PostingModal isVisible={isPosting} text="Creating your post..." />
    </div>
  );
}

interface StepNavProps {
  readonly onCancel?: () => void;
  readonly onNext: () => void;
  readonly onSkip?: () => void;
  readonly nextDisabled?: boolean;
  readonly nextLabel?: string;
  readonly skipLabel?: string;
}

function StepNav({
  onCancel,
  onNext,
  onSkip,
  nextDisabled = false,
  nextLabel = 'Next',
  skipLabel = 'Skip',
}: StepNavProps) {
  return (
    <div className={styles.stepNav}>
      <div className={styles.stepNavLeft}>
        {onCancel && (
          <Button className={`${styles.btnPill} ${styles.btnCancel}`} onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
      <div className={styles.stepNavRight}>
        {onSkip && (
          <Button className={`${styles.btnPill} ${styles.btnSecondary}`} onClick={onSkip}>
            {skipLabel}
          </Button>
        )}
        <Button className={styles.btnPill} onClick={onNext} disabled={nextDisabled}>
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}
