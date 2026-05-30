import type React from 'react';

type DotButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export const DotButton: React.FC<DotButtonProps> = ({ children, ...restProps }) => {
  return (
    <button type="button" {...restProps}>
      {children}
    </button>
  );
};
