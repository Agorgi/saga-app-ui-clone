import { Button } from '@saga/global-web';
import styles from './CollabButton.module.scss';

// Wireframe clone: full-variant collab CTA only. The icon variant + navigation
// are dropped since the clone has no post-creation flow.
export function CollabButton() {
  return <Button className={styles.collabButton}>Collab with this post!</Button>;
}
