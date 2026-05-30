import type React from 'react';
import styles from './Icon.module.scss';

interface IconProps {
  name: string; // Placeholder for actual icon library
  size?: string;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = '1em', color }) => {
  return (
    <span
      className={styles.icon}
      style={{ fontSize: size, color: color }}
      role="img"
      aria-label={name}
    >
      {/* Placeholder for actual icon, e.g., <i className={`fa fa-${name}`} /> */}
      <img
        src={`https://via.placeholder.com/${size.replace('em', '').replace('rem', '').replace('px', '')}?text=${name}`}
        alt={name}
      />
    </span>
  );
};
