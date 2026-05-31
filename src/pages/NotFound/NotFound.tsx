import { Button } from '@saga/global-web';
import { useNavigate } from 'react-router-dom';
import sagaConfused from '../../assets/saga-confused.png';
import styles from './NotFound.module.scss';

// Wireframe clone: matches the production 404 verbatim. It has no API or
// interactive logic to drop, so the DOM, classNames, copy, and the floating
// saga-confused mascot are reproduced exactly.
export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img src={sagaConfused} alt="Confused Saga character" className={styles.icon} />
        <h1 className={styles.title}>Oh no! We're lost!</h1>
        <p className={styles.message}>We searched everywhere, but this page doesn't exist.</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    </div>
  );
}
