import { readQuillObj } from '@components/QuillEditor/readQuillObj';
import { useAuth } from '@domains/auth';
import {
  useDeleteCrowdCommission,
  usePublishCrowdCommission,
  useUnpublishCrowdCommission,
} from '@domains/crowd-commissions/hooks/useCrowdCommissionMutations';
import { CommissionOwnerPanel } from '@domains/crowd-commissions/ui/CommissionOwnerPanel/CommissionOwnerPanel';
import { CommissionPledgeCard } from '@domains/crowd-commissions/ui/CommissionPledgeCard/CommissionPledgeCard';
import { CrowdCommissionConfirmModal } from '@domains/crowd-commissions/ui/Modals/CrowdCommissionConfirmModal';
import { StatusBadge } from '@domains/crowd-commissions/ui/StatusBadge/StatusBadge';
import { formatCents } from '@domains/crowd-commissions/utils/formatCurrency';
import {
  formatDeadline,
  getDaysRemaining,
  isDeadlinePassed,
} from '@domains/crowd-commissions/utils/formatDeadline';
import { useFeatures } from '@hooks/useFeatures';
import { useProfilePicture } from '@hooks/useProfilePicture';
import { useUserProfile } from '@hooks/useUserProfile';
import type { CrowdCommission } from '@saga/crowd-commission-middleware';
import { CrowdCommissionStatus } from '@saga/crowd-commission-middleware';
import { Avatar, BaseModal } from '@saga/global-web';
import { ChevronDown, Clock, X } from '@untitledui/icons';
import {
  getCrowdCommissionImageUrl,
  mapCrowdCommissionDescriptionImageIds,
} from '@utils/getImageUrls';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CommissionDetailSheet.module.scss';

type ConfirmModalState = 'none' | 'publish' | 'unpublish' | 'delete';

interface CommissionDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  commission: CrowdCommission;
}

export function CommissionDetailSheet({
  isOpen,
  onClose,
  commission: initialCommission,
}: CommissionDetailSheetProps) {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const { crowdCommissionsEnabled } = useFeatures();

  const [commission, setCommission] = useState(initialCommission);
  const [activeModal, setActiveModal] = useState<ConfirmModalState>('none');
  const [ownerPanelOpen, setOwnerPanelOpen] = useState(false);
  const [pledgeLoading, setPledgeLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setPledgeLoading(true);
    const timer = setTimeout(() => setPledgeLoading(false), 800);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const pledgeSectionRef = useRef<HTMLDivElement>(null);

  const creatorProfile = useUserProfile(commission.creatorId);
  const creatorAvatarUrl = useProfilePicture(commission.creatorId);
  const creatorName =
    creatorProfile?.displayName ?? creatorProfile?.userName ?? commission.creatorId;
  const creatorProfileUrl = creatorProfile?.userName
    ? `/profile/${creatorProfile.userName}`
    : undefined;

  const heroImageUrl = commission.heroImageUrl
    ? getCrowdCommissionImageUrl(commission.creatorId, commission.id, commission.heroImageUrl)
    : null;

  const { isLoading: isPublishing, execute: publish } = usePublishCrowdCommission();
  const { isLoading: isUnpublishing, execute: unpublish } = useUnpublishCrowdCommission();
  const { isLoading: isDeleting, execute: deleteCommission } = useDeleteCrowdCommission();

  const closeConfirmModal = useCallback(() => setActiveModal('none'), []);

  const handlePublishConfirm = useCallback(async () => {
    const updated = await publish(commission.id);
    if (updated !== undefined) {
      setCommission(updated);
      closeConfirmModal();
    }
  }, [commission.id, publish, closeConfirmModal]);

  const handleUnpublishConfirm = useCallback(async () => {
    const updated = await unpublish(commission.id);
    if (updated !== undefined) {
      setCommission(updated);
      closeConfirmModal();
    }
  }, [commission.id, unpublish, closeConfirmModal]);

  const handleDeleteConfirm = useCallback(async () => {
    const success = await deleteCommission(commission.id);
    if (success) {
      onClose();
      navigate(
        creatorProfile?.userName !== undefined
          ? `/profile/${creatorProfile.userName}?tab=commissions`
          : '/',
      );
    }
  }, [commission.id, creatorProfile?.userName, deleteCommission, navigate, onClose]);

  // Wireframe clone: production subscribes to live crowd-commission events here
  // (useCrowdCommissionSSE) to patch state in real time as backers pledge, goals are
  // reached, etc. Stripped in the clone since there is no backend or SSE connection.

  const isOwner = userId !== undefined && userId === commission.creatorId;
  const isActive = commission.status === CrowdCommissionStatus.ACTIVE;
  const canBack = crowdCommissionsEnabled && isActive;

  const raisedLabel = formatCents(commission.totalCollectedCents, commission.currency);
  const backersLabel =
    commission.backerCount === 1 ? '1 backer' : `${commission.backerCount} backers`;

  const deadlineIso = commission.fundingDeadlineAt;
  const deadlineLabel =
    deadlineIso && !isDeadlinePassed(deadlineIso)
      ? `${getDaysRemaining(deadlineIso)}d left`
      : deadlineIso
        ? formatDeadline(deadlineIso)
        : null;

  type ActiveConfirmModal = Exclude<ConfirmModalState, 'none'>;
  const confirmHandlers: Record<ActiveConfirmModal, () => void> = {
    publish: () => void handlePublishConfirm(),
    unpublish: () => void handleUnpublishConfirm(),
    delete: () => void handleDeleteConfirm(),
  };
  const confirmIsLoading: Record<ActiveConfirmModal, boolean> = {
    publish: isPublishing,
    unpublish: isUnpublishing,
    delete: isDeleting,
  };

  return (
    <>
      {activeModal !== 'none' && (
        <CrowdCommissionConfirmModal
          variant={activeModal}
          isOpen
          onConfirm={confirmHandlers[activeModal]}
          onCancel={closeConfirmModal}
          isLoading={confirmIsLoading[activeModal]}
          commissionStatus={commission.status}
        />
      )}

      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        overlayClassName={styles.overlay}
        className={styles.dialog}
        ariaLabel={commission.title}
        closeOnBackdrop
        closeOnEscape
      >
        <div className={styles.modal}>
          <div className={styles.dragHandle} aria-hidden="true" />

          {heroImageUrl ? (
            <div className={styles.heroZone}>
              <img
                className={styles.heroImage}
                src={heroImageUrl}
                alt=""
                aria-hidden="true"
                loading="lazy"
              />
              <div className={styles.heroOverlay} aria-hidden="true" />
              <button
                type="button"
                className={styles.closeHero}
                onClick={onClose}
                aria-label="Close"
              >
                <X width={15} height={15} aria-hidden="true" />
              </button>
              <div className={styles.heroText}>
                {creatorProfileUrl ? (
                  <a
                    href={creatorProfileUrl}
                    className={styles.creatorLink}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Avatar
                      name={creatorName}
                      type="user"
                      variant="xs"
                      imageUrl={creatorAvatarUrl ?? undefined}
                    />
                    <span className={styles.heroCreator}>{creatorName}</span>
                  </a>
                ) : (
                  <div className={styles.creatorLink}>
                    <Avatar
                      name={creatorName}
                      type="user"
                      variant="xs"
                      imageUrl={creatorAvatarUrl ?? undefined}
                    />
                    <span className={styles.heroCreator}>{creatorName}</span>
                  </div>
                )}
                <h2 className={styles.heroTitle}>{commission.title}</h2>
              </div>
            </div>
          ) : (
            <div className={styles.plainHeader}>
              <div className={styles.plainHeaderInfo}>
                {creatorProfileUrl ? (
                  <a
                    href={creatorProfileUrl}
                    className={styles.plainHeaderCreator}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Avatar
                      name={creatorName}
                      type="user"
                      variant="xs"
                      imageUrl={creatorAvatarUrl ?? undefined}
                    />
                    <span>{creatorName}</span>
                  </a>
                ) : (
                  <div className={styles.plainHeaderCreator}>
                    <Avatar
                      name={creatorName}
                      type="user"
                      variant="xs"
                      imageUrl={creatorAvatarUrl ?? undefined}
                    />
                    <span>{creatorName}</span>
                  </div>
                )}
                <h2 className={styles.plainHeaderTitle}>{commission.title}</h2>
              </div>
              <button
                type="button"
                className={styles.closePlain}
                onClick={onClose}
                aria-label="Close"
              >
                <X width={16} height={16} aria-hidden="true" />
              </button>
            </div>
          )}

          <div className={styles.metaRow}>
            <span className={styles.metaStats}>
              <span>{backersLabel}</span>
              <span className={styles.metaDot} aria-hidden="true">
                ·
              </span>
              <span className={styles.metaRaised}>{raisedLabel} raised</span>
            </span>
            <div className={styles.metaRight}>
              {deadlineLabel && (
                <span className={styles.metaDeadline}>
                  <Clock width={11} height={11} aria-hidden="true" />
                  {deadlineLabel}
                </span>
              )}
              <StatusBadge status={commission.status} />
            </div>
          </div>

          <div className={styles.body}>
            <CommissionPledgeCard
              commission={commission}
              canBack={canBack}
              pledgeSectionRef={pledgeSectionRef}
              isLoading={pledgeLoading}
            />

            {commission.description && (
              <section className={styles.descriptionSection} aria-label="Commission description">
                <h3 className={styles.descriptionHeading}>About this commission</h3>
                <div
                  className={`${styles.description} ql-snow ql-editor`}
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized by DOMPurify inside readQuillObj
                  dangerouslySetInnerHTML={{
                    __html: readQuillObj(
                      {
                        ...commission.description,
                        ops: mapCrowdCommissionDescriptionImageIds(
                          commission.description.ops,
                          commission.creatorId,
                          commission.id,
                        ),
                      },
                      'html',
                    ),
                  }}
                />
              </section>
            )}
          </div>

          {isOwner && (
            <div className={styles.ownerPanelWrap}>
              <button
                type="button"
                className={styles.ownerPanelTrigger}
                onClick={() => setOwnerPanelOpen((v) => !v)}
                aria-expanded={ownerPanelOpen}
              >
                <span className={styles.ownerPanelTriggerLabel}>Creator controls</span>
                <ChevronDown
                  width={16}
                  height={16}
                  className={[
                    styles.ownerPanelChevron,
                    ownerPanelOpen ? styles['ownerPanelChevron--open'] : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden="true"
                />
              </button>
              <div
                className={[
                  styles.ownerPanelContent,
                  ownerPanelOpen ? styles['ownerPanelContent--open'] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-hidden={!ownerPanelOpen}
              >
                <div className={styles.ownerPanelContentInner}>
                  <CommissionOwnerPanel
                    commission={commission}
                    variant="inline"
                    isPublishing={isPublishing}
                    isUnpublishing={isUnpublishing}
                    isDeleting={isDeleting}
                    onPublish={() => setActiveModal('publish')}
                    onUnpublish={() => setActiveModal('unpublish')}
                    onDelete={() => setActiveModal('delete')}
                    onUploadResult={() => {
                      onClose();
                      navigate('/create-post', {
                        state: { crowdCommissionId: commission.id, isPollCommission: false },
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </BaseModal>
    </>
  );
}
