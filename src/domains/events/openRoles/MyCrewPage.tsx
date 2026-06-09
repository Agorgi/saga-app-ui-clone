import { wireCrew } from '@/data/fixtures';
import { BackButton } from '@components/BackButton/BackButton';
import { MessageCircle01 } from '@untitledui/icons';
import { useNavigate } from 'react-router-dom';
import styles from './MyCrewPage.module.scss';

// Wireframe: the host's crew database. People saved from open-role applications
// collect here for reuse on future events. Fixture-backed; Message is inert.
export function MyCrewPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <BackButton onClick={() => navigate(-1)} />

      <div className={styles.header}>
        <h1 className={styles.title}>My crew</h1>
        <p className={styles.subtitle}>
          People you've saved from open roles, ready to pull into your next event.
        </p>
      </div>

      {wireCrew.length === 0 ? (
        <p className={styles.empty}>
          No saved crew yet. Save applicants from an event's open roles and they'll show up here.
        </p>
      ) : (
        <ul className={styles.list}>
          {wireCrew.map((member) => (
            <li key={member.id} className={styles.card}>
              <span className={styles.avatar} aria-hidden>
                {member.name.charAt(0)}
              </span>
              <div className={styles.body}>
                <div className={styles.nameRow}>
                  <span className={styles.name}>{member.name}</span>
                  <span className={styles.handle}>@{member.handle}</span>
                </div>
                {member.fromRole || member.fromEvent ? (
                  <span className={styles.meta}>
                    Saved from {member.fromRole}
                    {member.fromEvent ? ` at ${member.fromEvent}` : ''}
                  </span>
                ) : null}
                {member.note ? <p className={styles.note}>{member.note}</p> : null}
              </div>
              <button type="button" className={styles.msgBtn}>
                <MessageCircle01 width={15} height={15} aria-hidden />
                Message
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyCrewPage;
