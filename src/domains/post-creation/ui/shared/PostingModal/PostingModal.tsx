import { BaseModal, LoadingSymbol } from '@saga/global-web';
import styles from './PostingModal.module.scss';

interface PostingModalProps {
  readonly isVisible: boolean;
  readonly text?: string;
}

// Wireframe clone: copied near-verbatim. Shown briefly when the wizard "posts"
// (no real create call happens — the clone just navigates back to the feed).
export function PostingModal({ isVisible, text = 'Creating your post...' }: PostingModalProps) {
  return (
    <BaseModal
      isOpen={isVisible}
      onClose={() => {}}
      closeOnBackdrop={false}
      closeOnEscape={false}
      className={styles.postingModalContent}
    >
      <LoadingSymbol />
      <p className={styles.postingText}>{text}</p>
    </BaseModal>
  );
}
