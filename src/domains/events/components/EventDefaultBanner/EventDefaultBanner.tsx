import { assertNever } from '@saga/precedent-middleware';
import favicon from '../../../../../public/favicon.png';
import styles from './EventDefaultBanner.module.scss';

export interface EventDefaultBannerProps {
  /** Edge-to-edge ambience, or framed tile like the event hero banner slot */
  layout?: 'fill' | 'card';
  /** Logo watermark strength — none for colour-only ambience backgrounds */
  mark?: 'none' | 'subtle' | 'soft';
  className?: string;
}

function resolveMarkClass(mark: NonNullable<EventDefaultBannerProps['mark']>): string | undefined {
  switch (mark) {
    case 'subtle':
      return styles.markSubtle;
    case 'soft':
      return styles.markSoft;
    case 'none':
      return undefined;
    default:
      return assertNever(mark);
  }
}

export function EventDefaultBanner({
  layout = 'fill',
  mark = layout === 'card' ? 'soft' : 'subtle',
  className,
}: Readonly<EventDefaultBannerProps>) {
  const rootClassName = [
    styles.root,
    layout === 'fill' ? styles.rootFill : styles.rootCard,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const markClassName = [styles.mark, resolveMarkClass(mark)].filter(Boolean).join(' ');

  return (
    <div className={rootClassName} aria-hidden="true">
      <div className={styles.surface} />
      <div className={styles.ambientPrimary} />
      <div className={styles.ambientSecondary} />
      {mark !== 'none' ? (
        <div className={styles.markWrap}>
          <img src={favicon} alt="" className={markClassName} />
        </div>
      ) : null}
    </div>
  );
}
