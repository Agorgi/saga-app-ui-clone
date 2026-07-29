import { Calendar, CoinsHand, Edit01 } from '@untitledui/icons';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import styles from './CreateOptionsModal.module.scss';

// Wireframe clone: the source also renders a feature-gated Community option (behind
// useFeatures) whose route is outside this clone's scope. Post, Event, and Crowd
// Commission are reproduced and route to the in-scope creation flows. Crowd Commission
// is always enabled here; production gates it behind useFeatures plus a payments check.
// The sheet DOM, classNames, and copy match the source.
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

  const handleCreateCrowdCommission = () => {
    onClose();
    navigate('/crowd-commissions/new');
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

          <button type="button" className={styles.option} onClick={handleCreateCrowdCommission}>
            <div className={styles.optionIcon}>
              <CoinsHand className={styles.icon} />
            </div>
            <div className={styles.optionContent}>
              <span className={styles.optionTitle}>Crowd Commission</span>
              <span className={styles.optionDescription}>
                Create a commission funded by your community
              </span>
            </div>
          </button>
        </div>
      </dialog>
    </>,
    document.body,
  );
}
