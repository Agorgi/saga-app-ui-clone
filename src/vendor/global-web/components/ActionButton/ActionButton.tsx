import { formatCount } from '@saga/precedent-middleware';
import type React from 'react';
import styles from './ActionButton.module.scss';

export interface ActionButtonProps {
  icon: React.ReactNode;
  count?: number;
  label?: string;
  onClick?: (e: React.MouseEvent) => void;
  showCount?: boolean;
  showLabel?: boolean;
  isActive?: boolean;
  iconClassName?: string;
  countClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  count = 0,
  label,
  onClick,
  showCount = true,
  showLabel = true,
  isActive = false,
  iconClassName,
  countClassName,
  labelClassName,
  disabled = false,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick && !disabled) {
      onClick(e);
    }
  };

  return (
    <button
      className={`${styles.actionButton} ${isActive ? styles.active : ''} ${
        disabled ? styles.disabled : ''
      }`}
      onClick={handleClick}
      disabled={disabled}
      type="button"
    >
      <div className={styles.iconAndCount}>
        <span className={iconClassName || styles.icon}>{icon}</span>
        {showCount && <span className={countClassName || styles.count}>{formatCount(count)}</span>}
      </div>
      {showLabel && label && <span className={labelClassName || styles.label}>{label}</span>}
    </button>
  );
};
