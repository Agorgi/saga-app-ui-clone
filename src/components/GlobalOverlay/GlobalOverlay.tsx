import { BottomNavbar } from '@components/BottomNavbar/BottomNavbar';
import MobileTopNavbar from '@components/MobileTopNavbar/MobileTopNavbar';
import Navbar from '@components/Navbar/Navbar';
import { useLocation } from 'react-router-dom';
import styles from './GlobalOverlay.module.scss';

type GlobalOverlayProps = Readonly<{
  children: React.ReactNode;
}>;

export function GlobalOverlay({ children }: GlobalOverlayProps) {
  const location = useLocation();
  const isOnboarding = location.pathname.startsWith('/onboarding');

  return (
    <>
      {!isOnboarding && (
        <>
          <Navbar />
          <MobileTopNavbar />
        </>
      )}
      <main className={styles.mainContent}>{children}</main>
      {!isOnboarding && <BottomNavbar />}
    </>
  );
}
