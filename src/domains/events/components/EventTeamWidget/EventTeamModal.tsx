import { ProfilePictureIcon } from '@components/ProfilePictureIcon/ProfilePictureIcon';
import { getProfileUrl } from '@domains/posts/utils/getProfileUrl';
import { BaseModal } from '@saga/global-web';
import { Link } from 'react-router-dom';
import styles from './EventTeamModal.module.scss';
import type { TeamRow } from './EventTeamWidget';

interface EventTeamModalProps {
  readonly rows: readonly TeamRow[];
  readonly onClose: () => void;
}

export function EventTeamModal({ rows, onClose }: EventTeamModalProps) {
  return (
    <BaseModal
      isOpen
      onClose={onClose}
      ariaLabel="Meet the team"
      overlayClassName={styles.overlaySheet}
      className={styles.dialog}
    >
      <div className={styles.sheet}>
        <div className={styles.handle} aria-hidden="true" />

        <div className={styles.sheetHeader}>
          <h2 className={styles.sheetTitle}>Meet the team</h2>
          <div className={styles.countWrap}>
            <span className={styles.countNum}>{rows.length}</span>
            <span className={styles.countLabel}>{rows.length === 1 ? 'Person' : 'People'}</span>
          </div>
        </div>

        <div className={styles.listContainer}>
          <ul className={styles.userList}>
            {rows.map((row) => (
              <li key={row.userId} className={styles.userRow}>
                <Link
                  to={getProfileUrl(row.userName)}
                  className={styles.userLink}
                  onClick={onClose}
                >
                  <ProfilePictureIcon
                    displayName={row.displayName}
                    userId={row.userId}
                    variant="small"
                  />
                  <div className={styles.userInfo}>
                    <span className={styles.displayName}>{row.displayName}</span>
                    <span className={styles.userName}>@{row.userName}</span>
                  </div>
                  <span className={styles.roleBadge}>{row.roleLabel}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BaseModal>
  );
}
