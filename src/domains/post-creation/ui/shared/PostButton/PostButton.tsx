import { Button } from '@saga/global-web';
import styles from './PostButton.module.scss';

interface PostButtonProps {
  readonly disabled: boolean;
  readonly onClick: () => void;
  readonly label?: string;
  readonly pill?: boolean;
}

// Wireframe clone: the source fires a create_post analytics event on click and
// reads the username for the payload. Here we drop tracking and just render the
// submit button with the same container + pill classNames.
export function PostButton({ disabled, onClick, label = 'Post', pill = false }: PostButtonProps) {
  return (
    <div className={styles.postButtonContainer}>
      <Button className={pill ? styles.pill : undefined} onClick={onClick} disabled={disabled}>
        {label}
      </Button>
    </div>
  );
}
