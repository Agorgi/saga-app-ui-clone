import type { HTMLAttributes, RefObject } from 'react';

import styles from './Card.module.scss';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = ({
  className,
  ref,
  ...props
}: CardProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  const mergedClassName = className ? `${styles.card} ${className}` : styles.card;

  return <div ref={ref} className={mergedClassName} {...props} />;
};

Card.displayName = 'Card';
