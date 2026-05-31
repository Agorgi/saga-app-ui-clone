import { useAuth } from '@domains/auth/context/useAuth';
import { Button, useTrackEvent } from '@saga/global-web';
import { useState } from 'react';

type FollowButtonProps = {
  userId: string;
  className?: string;
  onFollowChange?: (detail: {
    actorUserId: string | null;
    targetUserId: string;
    action: 'follow' | 'unfollow';
  }) => void;
};

// Wireframe: follow state is local-only. The production component checks/sets
// follow status through `@saga/api-web`; here we just toggle a boolean so the
// button reflects an interaction without any network call.
export function FollowButton({ userId, className, onFollowChange }: FollowButtonProps) {
  const { trackEvent } = useTrackEvent();
  const { userId: currentUserId, userName } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    const action: 'follow' | 'unfollow' = isFollowing ? 'unfollow' : 'follow';
    setIsFollowing((prev) => !prev);
    trackEvent(action === 'follow' ? 'user_followed' : 'user_unfollowed', userName || '', {
      targetUserId: userId,
    });
    onFollowChange?.({ actorUserId: currentUserId || null, targetUserId: userId, action });
  };

  return (
    <Button onClick={handleFollow} className={className}>
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
}
