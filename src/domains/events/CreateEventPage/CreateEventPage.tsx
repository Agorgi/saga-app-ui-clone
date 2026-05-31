import { EventFormStepIndicator } from '@domains/events/components/EventFormStepIndicator/EventFormStepIndicator';
import { CommunitiesSection } from '@domains/events/sections/CommunitiesSection';
import type { EventDetailsValues } from '@domains/events/sections/EventDetailsSection';
import { EventDetailsSection } from '@domains/events/sections/EventDetailsSection';
import { PersonnelInviteSection } from '@domains/events/sections/PersonnelInviteSection';
import { fromDateTimeLocalToISO, validateEventDetails } from '@domains/events/utils/eventFormUtils';
import type {
  SalesWindow,
  TicketTypeDraft,
} from '@domains/tickets/sections/TicketTypeDraftSection/TicketTypeDraftSection';
import { TicketTypeDraftSection } from '@domains/tickets/sections/TicketTypeDraftSection/TicketTypeDraftSection';
import { Button, LoadingSymbol, toast } from '@saga/global-web';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/eventForm.module.scss';

interface LocationState {
  communityId?: string;
}

type Step = 1 | 2 | 3;

const STEPS: Record<Step, { title: string; subtitle: string }> = {
  1: { title: 'Create event', subtitle: 'Add the details for your event.' },
  2: { title: 'Tag communities', subtitle: 'Share your event with communities.' },
  3: { title: 'Add tickets', subtitle: 'Optionally add ticket types for your event.' },
};

const STEP_LABELS = ['Event details', 'Tag communities', 'Add tickets'] as const;

const INITIAL_DETAILS: EventDetailsValues = {
  name: '',
  startAt: '',
  endAt: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  location: '',
  locationCoords: undefined,
  description: '',
  banner: undefined,
  thumbnail: undefined,
};

// Wireframe clone: copied near-verbatim from the source's CreateEventPage. The
// three-step wizard (event details → communities → tickets) and all classNames
// are preserved. What's dropped: the real createEvent / createTicketType /
// invitePersonnel mutations, the Stripe payments gate (useHasPaymentsSetUp),
// and the timezone-aware sales-window resolution (date-fns-tz). "Create event"
// holds the submitting state briefly, then returns to the events list — no
// network. Personnel search runs over a fixture user list; image uploads
// preview via object URLs.
function CreateEventPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { communityId: preSelectedCommunityId } =
    (location.state as LocationState | undefined) ?? {};

  const [step, setStep] = useState<Step>(1);
  const [details, setDetails] = useState<EventDetailsValues>(INITIAL_DETAILS);
  const [selectedCommunityIds, setSelectedCommunityIds] = useState<string[]>(
    preSelectedCommunityId ? [preSelectedCommunityId] : [],
  );
  const [selectedCoHostIds, setSelectedCoHostIds] = useState<string[]>([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [ticketDrafts, setTicketDrafts] = useState<TicketTypeDraft[]>([]);
  const [salesWindow, setSalesWindow] = useState<SalesWindow>(() => ({
    startAt: '',
    endAt: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resolve the event's end-instant for the ticket sales window picker, which
  // uses it to disallow dates after the event ends.
  const eventEndDate = useMemo(() => {
    const iso = details.endAt ? fromDateTimeLocalToISO(details.endAt, details.timezone) : undefined;
    return iso ? new Date(iso) : undefined;
  }, [details.endAt, details.timezone]);

  const handleDetailsChange = <K extends keyof EventDetailsValues>(
    key: K,
    value: EventDetailsValues[K],
  ) => {
    setDetails((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    const error = validateEventDetails(details);
    if (error) {
      toast.error(error);
      return;
    }
    setStep(2);
  };

  const handleSubmit = () => {
    // Wireframe: no createEvent call fires. Hold the submitting state briefly,
    // then return to the events list (the source persists the event, ticket
    // types, and team invites, then redirects to the new event page).
    setIsSubmitting(true);
    window.setTimeout(() => {
      navigate('/events');
    }, 900);
  };

  const handleStepBack = () => {
    switch (step) {
      case 2:
        setStep(1);
        return;
      case 3:
        setStep(2);
        return;
      default:
        return;
    }
  };

  const onBack = step > 1 ? handleStepBack : undefined;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <EventFormStepIndicator
          stepLabels={STEP_LABELS}
          step={step}
          title={STEPS[step].title}
          subtitle={STEPS[step].subtitle}
          onBack={onBack}
          isSubmitting={isSubmitting}
        />

        {step === 1 && (
          <EventDetailsSection
            values={details}
            onChange={handleDetailsChange}
            onCancel={() => navigate('/events')}
            onSubmit={handleNext}
          >
            <PersonnelInviteSection
              selectedCoHostIds={selectedCoHostIds}
              onCoHostSelectionChange={setSelectedCoHostIds}
              selectedStaffIds={selectedStaffIds}
              onStaffSelectionChange={setSelectedStaffIds}
            />
          </EventDetailsSection>
        )}

        {step === 2 && (
          <CommunitiesSection
            selectedCommunityIds={selectedCommunityIds}
            onSelectionChange={setSelectedCommunityIds}
            onSubmit={() => setStep(3)}
            isSubmitting={false}
            submitLabel="Next"
          />
        )}

        {step === 3 && (
          <>
            <TicketTypeDraftSection
              drafts={ticketDrafts}
              onChange={setTicketDrafts}
              salesWindow={salesWindow}
              onSalesWindowChange={setSalesWindow}
              eventEndAt={eventEndDate}
            />
            <div className={styles.actions}>
              <Button
                type="button"
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{ flex: 1 }}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSymbol size="small" />
                    Create event...
                  </>
                ) : (
                  'Create event'
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CreateEventPage;
