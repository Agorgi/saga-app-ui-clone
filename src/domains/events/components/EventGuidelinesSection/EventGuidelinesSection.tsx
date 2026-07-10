import { Check } from '@untitledui/icons';
import styles from './EventGuidelinesSection.module.scss';

interface EventGuidelinesSectionProps {
  guidelines?: readonly string[];
}

// Wireframe clone: the source parses structured guideline entries with per-item
// icons; here guidelines are plain strings rendered with a uniform check icon.
export function EventGuidelinesSection({ guidelines }: EventGuidelinesSectionProps) {
  const items = (guidelines ?? []).filter((text) => text.trim().length > 0);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Guidelines</h2>
      <ul className={styles.list}>
        {items.map((text) => (
          <li key={text} className={styles.item}>
            <div className={styles.iconWrapper}>
              <Check width={18} height={18} aria-hidden="true" />
            </div>
            <span className={styles.text}>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
