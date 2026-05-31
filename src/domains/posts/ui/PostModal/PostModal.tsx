import { wirePosts } from '@/data/fixtures';
import { BaseModal } from '@saga/global-web';
import type React from 'react';
import { PostFullBody } from '../PostFullBody/PostFullBody';
import styles from './PostModal.module.scss';

interface PostModalProps {
  postId: string | undefined;
  onClose: () => void;
}

// Wireframe clone: the source fetches the post + parent/child relations via
// useFetchPostWithRelations. Here we look up a WirePost fixture by id and render
// the full body. Modal shell, class names, and structure match the real one.
const PostModal: React.FC<PostModalProps> = ({ postId, onClose }) => {
  const post = wirePosts.find((p) => p.id === postId);

  return (
    <BaseModal isOpen={true} onClose={onClose} className={styles.modalContent}>
      <div className={styles.modalContentInner}>
        {post ? <PostFullBody post={post} /> : null}
      </div>
    </BaseModal>
  );
};

export default PostModal;
