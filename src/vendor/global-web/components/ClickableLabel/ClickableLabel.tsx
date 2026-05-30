import styles from './ClickableLabel.module.scss';

type ClickableLabelProps = {
  readonly label: string;
  readonly icon?: string;
  readonly selected: boolean;
  readonly onToggle: () => void;
};

export function ClickableLabel({ label, icon, selected, onToggle }: ClickableLabelProps) {
  const hasIcon = icon && icon !== '';

  return (
    <button
      type="button"
      className={`${styles.card} ${selected ? styles.cardSelected : ''} ${hasIcon ? '' : styles.cardNoIcon}`}
      onClick={onToggle}
      aria-pressed={selected}
    >
      {hasIcon && (
        <span className={`${styles.icon} ${selected ? styles.iconSelected : ''}`} aria-hidden>
          {selected ? null : icon}
        </span>
      )}
      <span className={`${styles.label} ${hasIcon ? '' : styles.labelNoIcon}`}>{label}</span>
    </button>
  );
}
