import { ProfilePictureIcon } from '@components/ProfilePictureIcon/ProfilePictureIcon';
import { useCallback, useState } from 'react';
import { EventTeamModal } from './EventTeamModal';
import styles from './EventTeamWidget.module.scss';

const AVATAR_PREVIEW_COUNT = 3;

export interface TeamRow {
  readonly userId: string;
  readonly userName: string;
  readonly displayName: string;
  readonly roleLabel: string;
}

interface EventTeamWidgetProps {
  readonly rows: readonly TeamRow[];
}

// Wireframe clone: the source fetches personnel via getPersonnel(eventId) and
// prepends the host. Here the full team (host first) comes from a fixture; the
// preview tiles, "+N more" overflow, and the "Meet the team" modal are verbatim.
export function EventTeamWidget({ rows }: EventTeamWidgetProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = useCallback(() => setIsModalOpen(true), []);
  const handleClose = useCallback(() => setIsModalOpen(false), []);

  if (rows.length === 0) return null;

  const previewRows = rows.slice(0, AVATAR_PREVIEW_COUNT);
  const overflow = rows.length - previewRows.length;

  return (
    <>
      <button
        type="button"
        className={styles.card}
        onClick={handleOpen}
        aria-label={`Meet the team — view all ${rows.length} team members`}
      >
        <h2 className={styles.title}>Meet the team</h2>
        <div className={styles.previewRow}>
          {previewRows.map((row) => (
            <div key={row.userId} className={styles.previewTile}>
              <ProfilePictureIcon
                displayName={row.displayName}
                userId={row.userId}
                variant="med-large"
                className={styles.previewAvatar}
              />
              <span className={styles.previewName}>{row.displayName}</span>
            </div>
          ))}
          {overflow > 0 ? (
            <div className={styles.overflowTile}>
              <span className={styles.overflowCount}>+{overflow}</span>
              <span className={styles.overflowLabel}>more</span>
            </div>
          ) : null}
        </div>
      </button>

      {isModalOpen ? <EventTeamModal rows={rows} onClose={handleClose} /> : null}
    </>
  );
}
