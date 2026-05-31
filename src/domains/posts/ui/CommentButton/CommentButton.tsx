import { ActionButton } from '@saga/global-web';
import { AnnotationDots } from '@untitledui/icons';
import type React from 'react';

interface CommentButtonProps {
  count?: number;
  showLabel?: boolean;
  showCount?: boolean;
  iconClassName?: string;
  countClassName?: string;
  labelClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const CommentButton: React.FC<CommentButtonProps> = ({
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
      icon={<AnnotationDots />}
      count={count}
      label="Comments"
      showCount={showCount}
      showLabel={showLabel}
      iconClassName={iconClassName}
      countClassName={countClassName}
      labelClassName={labelClassName}
      onClick={handleClick}
    />
  );
};
