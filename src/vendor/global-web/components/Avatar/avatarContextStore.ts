import { createContext } from 'react';

export interface AvatarContextValue {
  defaultAvatars: string[];
}

export const AvatarContext = createContext<AvatarContextValue>({ defaultAvatars: [] });
