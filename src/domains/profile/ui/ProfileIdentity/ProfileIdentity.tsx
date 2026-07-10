import { LinkifyText } from '@components/AutoLink/LinkifyText';
import { toast } from '@saga/global-web';
import { Check, Link01 } from '@untitledui/icons';
import { type ReactNode, useCallback, useState } from 'react';
import styles from './ProfileIdentity.module.scss';

interface ProfileIdentityProps {
  readonly displayName: string;
  readonly userName: string;
  readonly bio?: string;
  readonly headerAddon?: ReactNode;
}

// Wireframe clone: copied from the source. The copy-link chip writes the profile
// URL to the clipboard (inert-friendly, no backend); bio is autolinked.
export function ProfileIdentity({ displayName, userName, bio, headerAddon }: ProfileIdentityProps) {
  const [copied, setCopied] = useState(false);
  const profileUrl = `${globalThis.window?.location?.origin ?? ''}/profile/${userName}`;

  const handleCopyClick = useCallback(async () => {
    try {
      await globalThis.navigator?.clipboard?.writeText(profileUrl);
      setCopied(true);
      globalThis.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  }, [profileUrl]);

  return (
    <div className={styles.identity}>
      <div className={styles.nameRow}>
        <h1 className={styles.displayName}>{displayName}</h1>
        {headerAddon}
      </div>

      <button
        type="button"
        className={[styles.handleChip, copied ? styles.handleChipCopied : '']
          .filter(Boolean)
          .join(' ')}
        onClick={handleCopyClick}
        aria-label={copied ? 'Profile link copied' : `Copy link to ${userName}'s profile`}
        title={copied ? 'Copied!' : 'Copy profile link'}
      >
        {copied ? (
          <>
            <Check className={styles.chipIcon} aria-hidden="true" />
            <span className={styles.chipLabel}>Copied</span>
          </>
        ) : (
          <>
            <span className={styles.handleText}>@{userName}</span>
            <span className={styles.chipDivider} aria-hidden="true" />
            <Link01 className={styles.chipIcon} aria-hidden="true" />
          </>
        )}
      </button>

      {bio ? (
        <LinkifyText text={bio} className={styles.bio} linkClassName={styles.bioLink} />
      ) : null}
    </div>
  );
}
