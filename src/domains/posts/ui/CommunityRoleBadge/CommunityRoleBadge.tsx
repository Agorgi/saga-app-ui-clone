import { CommunityMemberRole } from '@saga/community-middleware';
import type React from 'react';
import styles from './CommunityRoleBadge.module.scss';

interface CommunityRoleBadgeProps {
  role?: number;
}

const ROLE_CONFIG: Record<number, { label: string; className: string }> = {
  [CommunityMemberRole.ADMIN]: { label: 'Owner', className: 'owner' },
  [CommunityMemberRole.MODERATOR]: { label: 'Mod', className: 'mod' },
};

export const CommunityRoleBadge: React.FC<CommunityRoleBadgeProps> = ({ role }) => {
  if (role === undefined || role < CommunityMemberRole.MODERATOR) return null;
  const config = ROLE_CONFIG[role];
  if (!config) return null;

  return <span className={`${styles.badge} ${styles[config.className]}`}>{config.label}</span>;
};
