import { AddressInput, type AddressDetails } from '@components/AddressInput/AddressInput';
import { DateTimePicker } from '@components/DateTimePicker/DateTimePicker';
import { ImagesSection } from '@domains/events/sections/ImagesSection';
import { EVENT_DESCRIPTION_MAX_LENGTH, EVENT_NAME_MAX_LENGTH } from '@saga/events-middleware';
import { Button, FormField, LoadingSymbol, Stack } from '@saga/global-web';
import type { ReactNode } from 'react';
import { useId } from 'react';
import styles from '../styles/eventForm.module.scss';

// Wireframe clone: copied from the source's EventDetailsSection. The only
// deviations are wireframe dependencies — AddressInput is a plain input (so
// AddressDetails is imported from it rather than the Google Places hook) and
// ImagesSection previews via object URLs. The description label drops the
// source's em dash per the Saga copy rule.

export interface EventDetailsValues {
  name: string;
  startAt: string;
  endAt: string;
  timezone: string;
  location: string;
  locationCoords: Pick<AddressDetails, 'latitude' | 'longitude' | 'placeId'> | undefined;
  description: string;
  banner: string | undefined;
  thumbnail: string | undefined;
}

interface EventDetailsSectionProps {
  readonly values: EventDetailsValues;
  readonly onChange: <K extends keyof EventDetailsValues>(
    key: K,
    value: EventDetailsValues[K],
  ) => void;
  readonly onCancel: () => void;
  readonly onSubmit: () => void;
  readonly submitLabel?: string;
  readonly isSubmitting?: boolean;
  readonly disabled?: boolean;
  readonly children?: ReactNode;
}

export function EventDetailsSection({
  values,
  onChange,
  onCancel,
  onSubmit,
  submitLabel = 'Next',
  isSubmitting = false,
  disabled,
  children,
}: Readonly<EventDetailsSectionProps>) {
  const nameId = useId();
  const locationId = useId();
  const descriptionId = useId();

  const isDisabled = disabled ?? isSubmitting;

  return (
    <Stack className="precedent-gap-md">
      <FormField
        label="Event name"
        id={nameId}
        type="text"
        placeholder="e.g. Team meetup"
        value={values.name}
        onChange={(e) => onChange('name', e.target.value.slice(0, EVENT_NAME_MAX_LENGTH))}
        required
        maxLength={EVENT_NAME_MAX_LENGTH}
      />

      {children}

      <div className={styles.formGroup}>
        <span className={styles.label}>Event date &amp; time</span>
        <DateTimePicker
          startAt={values.startAt}
          endAt={values.endAt}
          timezone={values.timezone}
          onChange={onChange}
          onTimezoneChange={(tz) => onChange('timezone', tz)}
        />
      </div>

      <AddressInput
        label="Location (optional)"
        id={locationId}
        placeholder="Search for an address"
        value={values.location}
        onChange={(address, details) => {
          onChange('location', address);
          onChange('locationCoords', details);
        }}
      />

      <div className={styles.formGroup}>
        <label htmlFor={descriptionId} className={styles.label}>
          Description (optional): {values.description.length} / {EVENT_DESCRIPTION_MAX_LENGTH}{' '}
          characters
        </label>
        <textarea
          id={descriptionId}
          className={styles.textarea}
          placeholder="What's this event about?"
          value={values.description}
          maxLength={EVENT_DESCRIPTION_MAX_LENGTH}
          onChange={(e) =>
            onChange('description', e.target.value.slice(0, EVENT_DESCRIPTION_MAX_LENGTH))
          }
          rows={4}
        />
      </div>

      <ImagesSection
        banner={values.banner}
        thumbnail={values.thumbnail}
        onBannerChange={(value) => onChange('banner', value)}
        onThumbnailChange={(value) => onChange('thumbnail', value)}
        disabled={isDisabled}
      />

      <div className={styles.actions}>
        <Button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
          disabled={isDisabled}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className={styles.submitButton}
          onClick={onSubmit}
          disabled={isDisabled}
        >
          {isSubmitting ? (
            <>
              <LoadingSymbol size="small" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </Stack>
  );
}
