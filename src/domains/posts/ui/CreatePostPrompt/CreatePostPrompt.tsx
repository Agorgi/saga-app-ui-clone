import { wireProfile } from '@/data/fixtures';
import { Avatar } from '@saga/global-web';
import { Image03, Type01, VideoRecorder } from '@untitledui/icons';
import styles from './CreatePostPrompt.module.scss';

const postTypes = [
  { id: 'image', label: 'Image', icon: <Image03 /> },
  { id: 'editor', label: 'Text', icon: <Type01 /> },
  { id: 'video', label: 'Video', icon: <VideoRecorder /> },
];

// Wireframe clone: the create-post prompt. The source navigates into the
// post-creation flow on click; here the input + type buttons are inert.
export function CreatePostPrompt() {
  return (
    <div className={styles.createPostPrompt}>
      <div className={styles.inputSection}>
        <div className={styles.profilePicture}>
          <Avatar name={wireProfile.displayName} userId={wireProfile.username} type="user" variant="medium" />
        </div>
        <div className={styles.inputArea}>
          <input
            type="text"
            placeholder="Make some magic here..."
            className={styles.input}
            readOnly
          />
        </div>
      </div>
      <div className={styles.postTypes}>
        {postTypes.map((type) => (
          <button key={type.id} className={styles.typeButton} type="button">
            <span className={styles.icon}>{type.icon}</span>
            <span className={styles.label}>{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
