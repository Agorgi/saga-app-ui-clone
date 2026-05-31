import styles from './CommissionsTabContent.module.scss';

export interface CommissionsTabContentProps {
  profileUserId: string;
  isOwnProfile: boolean;
}

// Wireframe clone: the source paginates crowd-commission cards over live data
// with a view toggle and infinite scroll. The clone has no commissions, so it
// renders only the production empty state — the owner-vs-visitor copy split is
// preserved; the "create one" / payments links are dropped (no backend).
export function CommissionsTabContent({ profileUserId, isOwnProfile }: CommissionsTabContentProps) {
  if (isOwnProfile) {
    return <div className={styles.empty}>You haven&apos;t created any commissions yet.</div>;
  }

  return <div className={styles.empty}>No public commissions yet.</div>;
}
