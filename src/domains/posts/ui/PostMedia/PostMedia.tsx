import { Image03 } from '@untitledui/icons';
import styles from './PostMedia.module.scss';

// Wireframe clone: the source renders real images/video in an embla carousel.
// Here we show a neutral stand-in frame so the feed has the right shape with
// no real media.
export function PostMedia() {
  return (
    <div className={styles.mediaPlaceholder}>
      <Image03 />
      <span className={styles.placeholderLabel}>Image</span>
    </div>
  );
}
