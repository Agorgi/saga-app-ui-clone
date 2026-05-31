import { CommunitySelector } from '@components/CommunitySelector/CommunitySelector';
import { Button, LoadingSymbol, Stack } from '@saga/global-web';
import styles from '../styles/eventForm.module.scss';

interface CommunitiesSectionProps {
  readonly selectedCommunityIds: string[];
  readonly onSelectionChange: (communityIds: string[]) => void;
  readonly onSubmit: () => void;
  readonly isSubmitting: boolean;
  readonly submitLabel?: string;
}

export function CommunitiesSection({
  selectedCommunityIds,
  onSelectionChange,
  onSubmit,
  isSubmitting,
  submitLabel = 'Create event',
}: Readonly<CommunitiesSectionProps>) {
  return (
    <Stack className="precedent-gap-md">
      <CommunitySelector
        selectedCommunityIds={selectedCommunityIds}
        onSelectionChange={onSelectionChange}
        maxSelection={10}
      />

      <div className={styles.actions}>
        <Button
          type="button"
          className={styles.submitButton}
          onClick={onSubmit}
          disabled={isSubmitting}
          style={{ flex: 1 }}
        >
          {isSubmitting ? (
            <>
              <LoadingSymbol size="small" />
              {submitLabel}...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </Stack>
  );
}
