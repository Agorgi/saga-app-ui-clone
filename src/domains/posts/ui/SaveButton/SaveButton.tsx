import { ActionButton } from '@saga/global-web';
import { Bookmark } from '@untitledui/icons';
import { useCallback, useState } from 'react';
import styles from './SaveButton.module.scss';

interface SaveButtonProps {
  recordId: string;
  userId: string | undefined;
  initialSaveCount?: number;
  onSaveChange?: (saved: boolean, newCount: number) => void;
  iconClassName?: string;
  countClassName?: string;
  showLabel?: boolean;
  labelClassName?: string;
}

// Wireframe clone: the source fetches save state/count and toggles via the API
// (with optimistic updates, auth gating, tracking, and toasts). Here the toggle
// is local-only state so the icon, count, and active styling behave the same
// without any network. DOM, class names, and props match the real component.
export function SaveButton({
  recordId: _recordId,
  userId,
  initialSaveCount = 0,
  onSaveChange,
  iconClassName,
  countClassName,
  showLabel = false,
  labelClassName,
}: Readonly<SaveButtonProps>) {
  const [saved, setSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(initialSaveCount);

  const handleSaveToggle = useCallback(() => {
    const newSaved = !saved;
    const newCount = newSaved ? saveCount + 1 : saveCount - 1;
    setSaved(newSaved);
    setSaveCount(newCount);
    onSaveChange?.(newSaved, newCount);
  }, [saved, saveCount, onSaveChange]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSaveToggle();
  };

  return (
    <div
      className={`${styles.saveButton} ${saved ? styles.saved : ''}`}
      title={userId === undefined ? 'Sign in to save' : undefined}
    >
      <ActionButton
        icon={
          <Bookmark
            className={`${styles.icon} ${saved ? styles.iconSaved : ''} ${iconClassName || ''}`}
          />
        }
        count={saveCount}
        label="Saved"
        showCount={true}
        showLabel={showLabel}
        onClick={handleClick}
        isActive={saved}
        iconClassName={iconClassName}
        countClassName={countClassName}
        labelClassName={labelClassName}
      />
    </div>
  );
}
