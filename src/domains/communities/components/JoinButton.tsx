import { memo } from 'react';
import styles from './JoinButton.module.scss';

export interface JoinButtonProps {
  isMember?: boolean;
}

// Wireframe clone: static join/joined toggle button. The source wires real
// join/leave API calls; here it only reflects the passed-in state.
export const JoinButton = memo(({ isMember = false }: JoinButtonProps) => {
  return (
    <button
      type="button"
      className={`${styles.toggleButton} ${isMember ? styles.joined : styles.notJoined}`}
    >
      {isMember ? 'Joined' : 'Join'}
    </button>
  );
});
