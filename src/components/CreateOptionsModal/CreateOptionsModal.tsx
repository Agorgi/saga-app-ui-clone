import { Calendar, Edit01 } from '@untitledui/icons';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import styles from './CreateOptionsModal.module.scss';

// Wireframe clone: the source also renders feature-gated Community and Crowd
// Commission options (behind useFeatures / useHasPaymentsSetUp) whose routes are
// outside this clone's scope. The two always-available options, Post and Event,
// are reproduced verbatim and route to the in-scope creation flows. The sheet
// DOM, classNames, and copy match the source.
interface CreateOptionsModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function CreateOptionsModal({ isOpen, onClose }: CreateOptionsModalProps) {
  const navigate = useNavigate();

  const handleCreatePost = () => {
    onClose();
    navigate('/create-post');
  };

  const handleCreateEvent = () => {
    onClose();
    navigate('/events/create');
  };

  if (!isOpen) return undefined;

  return createPortal(
    <>
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        aria-label="Close create options"
        tabIndex={-1}
      />

      <dialog className={styles.sheet} open aria-modal="true" aria-label="Create options">
        <div className={styles.sheetHandle} />

        <div className={styles.header}>
          <h2 className={styles.title}>Create</h2>
        </div>

        <div className={styles.options}>
          <button type="button" className={styles.option} onClick={handleCreatePost}>
            <div className={styles.optionIcon}>
              <Edit01 className={styles.icon} />
            </div>
            <div className={styles.optionContent}>
              <span className={styles.optionTitle}>Post</span>
              <span className={styles.optionDescription}>
                Share your thoughts with the community
              </span>
            </div>
          </button>

          <button type="button" className={styles.option} onClick={handleCreateEvent}>
            <div className={styles.optionIcon}>
              <Calendar className={styles.icon} />
            </div>
            <div className={styles.optionContent}>
              <span className={styles.optionTitle}>Event</span>
              <span className={styles.optionDescription}>
                Organize a gathering for your community
              </span>
            </div>
          </button>
        </div>
      </dialog>
    </>,
    document.body,
  );
}
