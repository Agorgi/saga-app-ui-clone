import styles from './CharacterCount.module.scss';

export interface CharacterCountProps {
  current: number;
  max: number;
  className?: string;
}

export function CharacterCount({ current, max, className }: Readonly<CharacterCountProps>) {
  const ratio = current / max;
  const stateClass = ratio >= 1 ? styles.atLimit : '';
  const warnClass = stateClass || (ratio >= 0.9 ? styles.nearLimit : '');

  return (
    <span className={`${styles.characterCount} ${warnClass} ${className ?? ''}`}>
      {current}/{max}
    </span>
  );
}
