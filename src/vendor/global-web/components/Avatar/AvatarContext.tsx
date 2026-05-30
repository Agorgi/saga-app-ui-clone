import type React from 'react';
import { AvatarContext } from './avatarContextStore';

interface AvatarProviderProps {
  defaultAvatars: string[];
  children: React.ReactNode;
}

export function AvatarProvider({ defaultAvatars, children }: AvatarProviderProps) {
  return <AvatarContext.Provider value={{ defaultAvatars }}>{children}</AvatarContext.Provider>;
}
