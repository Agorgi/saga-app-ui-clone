import { wireInterestChecks } from '@/data/fixtures';
import { Link, useParams } from 'react-router-dom';
import { InterestCheckDetail } from './InterestCheckDetail';
import styles from './InterestCheckDetail.module.scss';

// Route wrapper: resolves the interest check by id from fixtures and renders the detail.
// `key` resets the detail's local state when navigating between fixtures.
export default function InterestCheckDetailPage() {
  const { id } = useParams<{ id: string }>();
  const interestCheck = wireInterestChecks.find((ic) => ic.id === id);

  if (!interestCheck) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <p>This interest check could not be found.</p>
          <Link to="/events" className={styles.backLink}>
            Back to events
          </Link>
        </div>
      </div>
    );
  }

  return <InterestCheckDetail key={interestCheck.id} initial={interestCheck} />;
}
