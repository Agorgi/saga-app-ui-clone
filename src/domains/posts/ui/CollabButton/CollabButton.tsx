import { Button } from '@saga/global-web';
import { IntersectCircle } from '@untitledui/icons';
import type React from 'react';
import styles from './CollabButton.module.scss';

interface CollabButtonProps {
  onClick: () => void;
  variant?: 'full' | 'icon';
  disabled?: boolean;
}

// Wireframe clone: identical to the source except the icon variant uses the
// @untitledui IntersectCircle directly (the source's <Icon name="MdIntersectCircle" />
// resolves to a remote asset we don't pull into the clone).
export const CollabButton: React.FC<CollabButtonProps> = ({
  onClick,
  variant = 'full',
  disabled = false,
}) => {
  if (variant === 'icon') {
    return (
      <button
        type="button"
        className={styles.collabIconButton}
        onClick={onClick}
        disabled={disabled}
        aria-label="Collab with this post"
      >
        <IntersectCircle width="1.5rem" height="1.5rem" />
      </button>
    );
  }

  return (
    <Button className={styles.collabButton} onClick={onClick} disabled={disabled}>
      Collab with this post!
    </Button>
  );
};
