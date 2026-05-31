import { useProfilePicture } from '@hooks/useProfilePicture';
import { Avatar, type AvatarVariant } from '@saga/global-web';

type ProfilePictureIconProps = Readonly<{
  displayName: string;
  userId?: string;
  profilePictureUrl?: string;
  variant?: AvatarVariant;
  className?: string;
}>;

/**
 * A wrapper around Avatar that adds the ability to fetch profile pictures by userId.
 * If userId is provided, it fetches the profile picture; otherwise uses the provided profilePictureUrl.
 * All styling is handled by Avatar - this component is just for data fetching.
 */
export function ProfilePictureIcon({
  displayName,
  userId,
  profilePictureUrl: providedPfpUrl,
  variant = 'medium',
  className,
}: ProfilePictureIconProps) {
  // Fetch profile picture by userId if provided, otherwise use provided profilePictureUrl
  const fetchedPfpUrl = useProfilePicture(userId);
  const pfpUrl = providedPfpUrl || fetchedPfpUrl;

  return (
    <Avatar
      name={displayName}
      userId={userId}
      type="user"
      variant={variant}
      imageUrl={pfpUrl}
      className={className}
    />
  );
}
