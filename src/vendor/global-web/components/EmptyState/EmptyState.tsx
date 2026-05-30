import type React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EmptyState.module.scss';

interface EmptyStateProps {
  title?: string;
  message?: string;
  showCreateButton?: boolean;
  icon?: string;
  /** Override the default Create Post navigation. When provided, called instead of navigating to /create-post. */
  onCreatePost?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "There's nothing here yet!",
  message = 'Saga-san is waiting for you to share something awesome!',
  showCreateButton = true,
  icon,
  onCreatePost,
}) => {
  const navigate = useNavigate();

  const handleCreatePost = onCreatePost ?? (() => navigate('/create-post'));

  return (
    <div className={styles.container}>
      {icon && <img src={icon} alt="" className={styles.icon} />}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {showCreateButton && (
        <button className={styles.button} type="button" onClick={handleCreatePost}>
          Create Post
        </button>
      )}
    </div>
  );
};
