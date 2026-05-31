import { ActionButton } from '@saga/global-web';
import { IntersectCircle } from '@untitledui/icons';
import type React from 'react';

interface CollabCountButtonProps {
  count?: number;
  showLabel?: boolean;
  showCount?: boolean;
  iconClassName?: string;
  countClassName?: string;
  labelClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const CollabCountButton: React.FC<CollabCountButtonProps> = ({
  count = 0,
  showLabel = false,
  showCount = true,
  iconClassName,
  countClassName,
  labelClassName,
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <ActionButton
      icon={<IntersectCircle />}
      count={count}
      label="Collabs"
      showCount={showCount}
      showLabel={showLabel}
      iconClassName={iconClassName}
      countClassName={countClassName}
      labelClassName={labelClassName}
      onClick={handleClick}
    />
  );
};
