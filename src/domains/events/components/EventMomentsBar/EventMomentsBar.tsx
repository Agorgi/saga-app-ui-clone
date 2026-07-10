import { CameraPlus } from '@untitledui/icons';
import styles from './EventMomentsBar.module.scss';

// Wireframe clone: the source Moments bar loads event photo posts and renders a
// horizontal thumbnail strip (with an OpenFeature-driven image width, thumbnail
// fetching, and a lightbox modal). The clone contract has no real media, so this
// renders the widget's honest empty state — a real state of the component that
// needs no images. The populated photo-grid state is deferred until the clone
// carries seed media.
export function EventMomentsBar() {
  return (
    <section className={styles.widget} aria-label="Event moments">
      <div className={styles.header}>
        <h2 className={styles.title}>Moments</h2>
      </div>

      <button type="button" className={styles.emptyState}>
        <CameraPlus width={22} height={22} aria-hidden="true" className={styles.emptyIcon} />
        <span className={styles.emptyTitle}>No moments yet</span>
        <span className={styles.emptyHint}>Be the first to share from this event</span>
      </button>
    </section>
  );
}
