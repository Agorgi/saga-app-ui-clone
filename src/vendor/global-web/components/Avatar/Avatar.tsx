import { useNumberFlagValue } from '@openfeature/react-sdk';
import { useMemo } from 'react';
import styles from './Avatar.module.scss';
import { pickAvatarIndex, useAvatarContext } from './avatarContextUtils';

export type AvatarVariant =
  | 'xs'
  | 'small'
  | 'medium'
  | 'med-large'
  | 'large'
  | 'profile'
  | 'community-small'
  | 'community-large';

type AvatarType = 'user' | 'community';

interface AvatarProps {
  name: string;
  userId?: string;
  type?: AvatarType;
  variant?: AvatarVariant;
  imageUrl?: string;
  className?: string;
}

// Map variant to pixel size
const getVariantSize = (
  variant: AvatarVariant,
  imageWidthSmall: number,
  imageWidthXs: number,
): number => {
  if (variant === 'community-large' || variant === 'profile' || variant === 'medium') {
    return imageWidthSmall;
  }
  return imageWidthXs;
};

// Add width query parameter to image URL if it's a CDN URL
const addWidthToUrl = (url: string, width: number): string => {
  // Don't modify dicebear URLs, or local object/data URLs used for previews —
  // appending a query string to a blob:/data: URL produces an invalid URL the
  // browser cannot resolve, breaking the <img>.
  if (url.includes('dicebear.com') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }

  // If URL already has query parameters, append with &, otherwise use ?
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}w=${width}`;
};

export function Avatar({
  name,
  userId,
  type = 'user',
  variant = 'medium',
  imageUrl,
  className,
}: AvatarProps) {
  // Get feature flag values
  const imageWidthSmall: number = useNumberFlagValue('image-width-small', 512);
  const imageWidthXs: number = useNumberFlagValue('image-width-xs', 256);

  const { defaultAvatars } = useAvatarContext();

  // Generate default avatar URL for users
  const defaultAvatarUrl = useMemo(() => {
    if (type === 'community') {
      return undefined;
    }
    if (defaultAvatars.length > 0) {
      const seed = userId ?? name;
      return defaultAvatars[pickAvatarIndex(seed, defaultAvatars.length)];
    }
    // Fallback to dicebear if no defaultAvatars provided
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      name,
    )}&backgroundColor=6366f1`;
  }, [name, userId, type, defaultAvatars]);

  // Get the size for the current variant
  const size = getVariantSize(variant, imageWidthSmall, imageWidthXs);

  // Add width parameter to imageUrl if provided, otherwise use default
  const currentImageUrl = useMemo(() => {
    if (imageUrl) {
      return addWidthToUrl(imageUrl, size);
    }
    return defaultAvatarUrl;
  }, [imageUrl, defaultAvatarUrl, size]);

  // Determine CSS classes based on variant
  const getSizeClass = () => {
    if (variant === 'community-small') return styles.communitySmall;
    if (variant === 'community-large') return styles.communityLarge;
    if (variant === 'profile') return styles.profile;
    return styles[`size--${variant}`];
  };

  const imageClassName = `${getSizeClass()} ${className || ''}`;

  // For communities without image, show placeholder with first letter
  if (type === 'community' && !currentImageUrl) {
    const placeholderClass =
      variant === 'community-large'
        ? `${styles.placeholder} ${styles.communityLarge}`
        : styles.placeholder;
    return <div className={placeholderClass}>{name.charAt(0).toUpperCase()}</div>;
  }

  return (
    <img
      src={currentImageUrl}
      alt={`${name} ${type === 'user' ? 'profile picture' : 'thumbnail'}`}
      className={imageClassName}
      loading="lazy"
      decoding="async"
      onContextMenu={(e) => e.preventDefault()}
      draggable={false}
    />
  );
}
