import type { Post } from '@saga/records-middleware';
import { ParentPostInput } from '../ParentPostInput/ParentPostInput';
import styles from './PostHeaderSection.module.scss';

const TITLE_MAX = 150;

interface PostHeaderSectionProps {
  readonly title: string;
  readonly onTitleChange: (title: string) => void;
  readonly parentPost: Post | null;
  readonly onParentPostChange: (post: Post | null) => void;
  readonly parentPostUrl: string;
  readonly onParentPostUrlChange: (url: string) => void;
  readonly readOnly?: boolean;
}

// Wireframe clone: the source reads the title cap from a feature flag
// (useNumberFlagValue 'title-max-length', 150). The clone has no flag client, so
// the default 150 is hardcoded. DOM + classNames match the source.
export function PostHeaderSection({
  title,
  onTitleChange,
  parentPost,
  onParentPostChange,
  parentPostUrl,
  onParentPostUrlChange,
  readOnly = false,
}: PostHeaderSectionProps) {
  return (
    <div className={styles.formFields}>
      <input
        type="text"
        placeholder={`Title (max ${TITLE_MAX} characters)`}
        value={title}
        onChange={(e) => onTitleChange(e.target.value.slice(0, TITLE_MAX))}
        className={styles.titleInput}
        maxLength={TITLE_MAX}
        required
      />
      <ParentPostInput
        parentPost={parentPost}
        onParentPostChange={onParentPostChange}
        parentPostUrl={parentPostUrl}
        onParentPostUrlChange={onParentPostUrlChange}
        readOnly={readOnly}
      />
    </div>
  );
}
