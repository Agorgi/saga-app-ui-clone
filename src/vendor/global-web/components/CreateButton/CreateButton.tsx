import { PlusCircle } from '@untitledui/icons';
import { Button } from '../Button/Button';
import styles from './CreateButton.module.scss';

interface CreateButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export function CreateButton({ onClick, className, disabled }: CreateButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`${styles.createButton} ${className || ''}`}
      disabled={disabled}
    >
      <span className={styles.createText}>Create</span>
      <PlusCircle className={styles.createIcon} />
    </Button>
  );
}
