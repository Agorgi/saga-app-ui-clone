import { useAuth } from '@domains/auth';
import { PostFeed } from '@domains/posts/ui/PostFeed/PostFeed';
import { toast } from '@saga/global-web';
import { Navigate } from 'react-router-dom';
import styles from './FollowingFeed.module.scss';

// Wireframe clone: the Following feed shows posts from followed users. The clone
// has no follow graph, so the same placeholder feed renders here as on Home; the
// container, header, and auth gate match the source.
export default function FollowingFeedPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    toast.info('Please log in to view the Following feed');
    return <Navigate to="/" replace />;
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Following</h1>
      </div>
      <PostFeed feedType="following" viewContext="feed" />
    </div>
  );
}
