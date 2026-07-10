import type { CommunitySocialPlatform } from '@saga/community-middleware';
import { Globe01 } from '@untitledui/icons';
import type { SimpleIcon } from 'simple-icons';
import {
  siDiscord,
  siFacebook,
  siInstagram,
  siKakaotalk,
  siLine,
  siPinterest,
  siReddit,
  siSnapchat,
  siTelegram,
  siThreads,
  siTiktok,
  siTwitch,
  siWechat,
  siWhatsapp,
  siX,
  siYoutube,
} from 'simple-icons';

export interface SocialPlatformIconProps {
  readonly platform: CommunitySocialPlatform;
  readonly size?: number;
  readonly className?: string;
}

interface SvgIconProps {
  readonly path: string;
  readonly size: number;
  readonly className?: string;
}

type PlatformIconConfig =
  | { readonly type: 'simple-icon'; readonly icon: SimpleIcon }
  | { readonly type: 'svg-path'; readonly path: string }
  | { readonly type: 'globe' };

/** LinkedIn was removed from simple-icons; path retained from the CC0 Simple Icons archive. */
const LINKEDIN_ICON_PATH =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';

// Central registry for platform icons. Add new platforms here.
const PLATFORM_ICON_CONFIGS: Record<CommunitySocialPlatform, PlatformIconConfig> = {
  discord: { type: 'simple-icon', icon: siDiscord },
  instagram: { type: 'simple-icon', icon: siInstagram },
  youtube: { type: 'simple-icon', icon: siYoutube },
  x: { type: 'simple-icon', icon: siX },
  tiktok: { type: 'simple-icon', icon: siTiktok },
  twitch: { type: 'simple-icon', icon: siTwitch },
  facebook: { type: 'simple-icon', icon: siFacebook },
  reddit: { type: 'simple-icon', icon: siReddit },
  wechat: { type: 'simple-icon', icon: siWechat },
  kakao: { type: 'simple-icon', icon: siKakaotalk },
  telegram: { type: 'simple-icon', icon: siTelegram },
  whatsapp: { type: 'simple-icon', icon: siWhatsapp },
  linkedin: { type: 'svg-path', path: LINKEDIN_ICON_PATH },
  snapchat: { type: 'simple-icon', icon: siSnapchat },
  threads: { type: 'simple-icon', icon: siThreads },
  pinterest: { type: 'simple-icon', icon: siPinterest },
  line: { type: 'simple-icon', icon: siLine },
  website: { type: 'globe' },
};

function SvgIcon({ path, size, className }: SvgIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d={path} fill="currentColor" />
    </svg>
  );
}

function BrandIcon({
  icon,
  size,
  className,
}: {
  icon: SimpleIcon;
  size: number;
  className?: string;
}) {
  return <SvgIcon path={icon.path} size={size} className={className} />;
}

export function SocialPlatformIcon({ platform, size = 18, className }: SocialPlatformIconProps) {
  const config = PLATFORM_ICON_CONFIGS[platform]!;

  if (config.type === 'globe') {
    return <Globe01 width={size} height={size} aria-hidden="true" className={className} />;
  }

  if (config.type === 'svg-path') {
    return <SvgIcon path={config.path} size={size} className={className} />;
  }

  return <BrandIcon icon={config.icon} size={size} className={className} />;
}
