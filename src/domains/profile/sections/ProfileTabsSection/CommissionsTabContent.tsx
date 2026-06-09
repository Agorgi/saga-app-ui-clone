import { wireCommissions } from '@/data/fixtures';
import { CommissionFeedCard } from '@domains/crowd-commissions/ui/CommissionFeedCard/CommissionFeedCard';
import styles from './CommissionsTabContent.module.scss';

export interface CommissionsTabContentProps {
  profileUserId: string;
  isOwnProfile: boolean;
}

// Wireframe clone: production paginates this profile's crowd commissions over live data
// (useCrowdCommissions) with a view toggle and infinite scroll. The clone renders the
// placeholder commissions from fixtures in the simple list layout and preserves the
// production empty state (owner vs visitor copy) for the no-commissions case.
export function CommissionsTabContent({ profileUserId, isOwnProfile }: CommissionsTabContentProps) {
  void profileUserId;
  const commissions = wireCommissions;

  if (commissions.length === 0) {
    if (isOwnProfile) {
      return <div className={styles.empty}>You haven&apos;t created any commissions yet.</div>;
    }
    return <div className={styles.empty}>No public commissions yet.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {commissions.map((c) => (
          <CommissionFeedCard key={c.id} commission={c} />
        ))}
      </div>
    </div>
  );
}
