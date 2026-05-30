import { MarkerPin01 } from '@untitledui/icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './LocationDisplay.module.scss';

export interface LocationDisplayProps {
  readonly location: string;
}

export function LocationDisplay({ location }: Readonly<LocationDisplayProps>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);

  const handleOpenGoogleMaps = useCallback(() => {
    const encodedLocation = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/search/${encodedLocation}`, '_blank');
    setIsMenuOpen(false);
  }, [location]);

  const handleOpenAppleMaps = useCallback(() => {
    const encodedLocation = encodeURIComponent(location);
    window.open(`https://maps.apple.com/?q=${encodedLocation}`, '_blank');
    setIsMenuOpen(false);
  }, [location]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(location).then(() => {
      setIsMenuOpen(false);
    });
  }, [location]);

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={styles.locationButton}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <MarkerPin01 className={styles.locationIcon} />
        <span className={styles.locationText}>{location}</span>
      </button>

      {isMenuOpen && (
        <div className={styles.menu}>
          <button type="button" className={styles.menuItem} onClick={handleOpenGoogleMaps}>
            Open in Google Maps
          </button>
          <button type="button" className={styles.menuItem} onClick={handleOpenAppleMaps}>
            Open in Apple Maps
          </button>
          <button type="button" className={styles.menuItem} onClick={handleCopy}>
            Copy
          </button>
        </div>
      )}
    </div>
  );
}
