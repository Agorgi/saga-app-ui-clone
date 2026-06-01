import { CurrencyDollarCircle, Hand, Star01, Ticket02 } from '@untitledui/icons';
import { useNavigate } from 'react-router-dom';
import styles from './CreateEventChooser.module.scss';

// Wireframe clone: the first step of posting an event. Before any form, the user
// picks whether the event is paid or free-to-RSVP. Each choice routes to the
// single-page event form (the free form is the paid form minus the ticket
// section). No clapping-hands glyph exists in @untitledui/icons, so the
// "Free to RSVP" mark is composed from a Hand with small stars around it.
function CreateEventPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Is your event?</h1>

        <div className={styles.options}>
          <button
            type="button"
            className={styles.option}
            onClick={() => navigate('/events/create/paid')}
          >
            <span className={styles.iconStack}>
              <Ticket02 className={styles.iconBase} aria-hidden />
              <CurrencyDollarCircle className={styles.iconOverlay} aria-hidden />
            </span>
            <span className={styles.optionLabel}>Paid</span>
          </button>

          <button
            type="button"
            className={styles.option}
            onClick={() => navigate('/events/create/free')}
          >
            <span className={styles.iconStack}>
              <Hand className={styles.iconBase} aria-hidden />
              <Star01 className={styles.iconStarTop} aria-hidden />
              <Star01 className={styles.iconStarLeft} aria-hidden />
              <Star01 className={styles.iconStarRight} aria-hidden />
            </span>
            <span className={styles.optionLabel}>Free to RSVP</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateEventPage;
