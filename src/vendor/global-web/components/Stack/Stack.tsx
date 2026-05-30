import type { HTMLAttributes, RefObject } from 'react';

const BASE_CLASSNAME = 'precedent-flex precedent-flex-column';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {}

export const Stack = ({
  className,
  ref,
  ...props
}: StackProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  const mergedClassName = className ? `${BASE_CLASSNAME} ${className}` : BASE_CLASSNAME;

  return <div ref={ref} className={mergedClassName} {...props} />;
};

Stack.displayName = 'Stack';
