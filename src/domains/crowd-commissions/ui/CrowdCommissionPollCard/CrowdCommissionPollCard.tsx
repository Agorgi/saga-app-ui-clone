import { useAuth } from '@domains/auth';
import {
  POLL_CHECKOUT_COMMISSION_SEARCH_PARAM,
  POLL_CHECKOUT_PAID_SEARCH_PARAM,
} from '@domains/crowd-commissions/constants/pollCheckoutReturnParams';
import {
  useDeleteCrowdCommission,
  usePublishCrowdCommission,
  useUnpublishCrowdCommission,
} from '@domains/crowd-commissions/hooks/useCrowdCommissionMutations';
import { usePickWinner } from '@domains/crowd-commissions/hooks/usePickWinner';
import { usePollResults } from '@domains/crowd-commissions/hooks/usePollResults';
import { usePollCheckout, usePollVote } from '@domains/crowd-commissions/hooks/usePollVote';
import { CommissionOwnerPanel } from '@domains/crowd-commissions/ui/CommissionOwnerPanel/CommissionOwnerPanel';
import { CrowdCommissionConfirmModal } from '@domains/crowd-commissions/ui/Modals/CrowdCommissionConfirmModal';
import { PollCard } from '@domains/crowd-commissions/ui/Poll';
import { useProfilePicture } from '@hooks/useProfilePicture';
import { useUserProfile } from '@hooks/useUserProfile';
import type { CrowdCommission } from '@saga/crowd-commission-middleware';
import { getCrowdCommissionImageUrl } from '@utils/getImageUrls';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CrowdCommissionPollModal } from '../CrowdCommissionPollModal/CrowdCommissionPollModal';

interface CrowdCommissionPollCardProps {
  commission: CrowdCommission;
  variant?: 'default' | 'list';
  /** When provided, clicking the card navigates instead of opening the vote modal. */
  onNavigate?: () => void;
}

export function CrowdCommissionPollCard({
  commission,
  variant,
  onNavigate,
}: CrowdCommissionPollCardProps) {
  const { userId } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: pollResults, refetch } = usePollResults(commission.id);
  const { startCheckout, isRedirecting } = usePollCheckout(commission.id);
  const { castVote } = usePollVote(commission.id);
  const { pickWinner } = usePickWinner(commission.id, refetch);

  // Auto-open modal when returning from Stripe checkout (see CrowdCommissionPollService.initiateCheckout)
  useEffect(() => {
    if (searchParams.get(POLL_CHECKOUT_PAID_SEARCH_PARAM) !== 'true') return;

    const paramCommissionId = searchParams.get(POLL_CHECKOUT_COMMISSION_SEARCH_PARAM);
    const isMainFeedPath = location.pathname === '/' || location.pathname === '/feed';

    // Home feed: PollCheckoutReturnHandler owns the modal + query cleanup
    if (paramCommissionId !== null && isMainFeedPath) return;

    if (paramCommissionId !== null && paramCommissionId !== commission.id) return;

    if (paramCommissionId === null) return;

    setIsModalOpen(true);
    setSearchParams(
      (prev) => {
        prev.delete(POLL_CHECKOUT_PAID_SEARCH_PARAM);
        prev.delete(POLL_CHECKOUT_COMMISSION_SEARCH_PARAM);
        return prev;
      },
      { replace: true },
    );
  }, [searchParams, setSearchParams, commission.id, location.pathname]);

  const [localCommission, setLocalCommission] = useState(commission);

  const { execute: publishCommission, isLoading: isPublishing } = usePublishCrowdCommission();
  const { execute: unpublishCommission, isLoading: isUnpublishing } = useUnpublishCrowdCommission();
  const { execute: deleteCommission, isLoading: isDeleting } = useDeleteCrowdCommission();

  const creatorProfile = useUserProfile(commission.creatorId);
  const creatorName =
    creatorProfile?.displayName ?? creatorProfile?.userName ?? commission.creatorId;
  const creatorAvatarUrl = useProfilePicture(commission.creatorId);
  const creatorProfileUrl = creatorProfile?.userName
    ? `/profile/${creatorProfile.userName}`
    : undefined;

  const heroImageUrl = commission.heroImageUrl
    ? getCrowdCommissionImageUrl(commission.creatorId, commission.id, commission.heroImageUrl)
    : null;

  const options = pollResults?.options ?? commission.pollOptions ?? [];

  const isCreator = userId === commission.creatorId;

  const handleCheckout = useCallback(
    (amountCents: number) => {
      if (!isRedirecting) void startCheckout(amountCents);
    },
    [startCheckout, isRedirecting],
  );

  const handleVote = useCallback(
    async (optionId: string) => {
      await castVote(optionId);
      void refetch();
    },
    [castVote, refetch],
  );

  const handlePublish = useCallback(async () => {
    const updated = await publishCommission(localCommission.id);
    if (updated !== undefined) setLocalCommission(updated);
  }, [localCommission.id, publishCommission]);

  const handleUnpublish = useCallback(async () => {
    const updated = await unpublishCommission(localCommission.id);
    if (updated !== undefined) setLocalCommission(updated);
  }, [localCommission.id, unpublishCommission]);

  const handleConfirmDelete = useCallback(async () => {
    const deleted = await deleteCommission(localCommission.id);
    if (deleted) {
      setIsDeleteModalOpen(false);
      setIsModalOpen(false);
    }
  }, [localCommission.id, deleteCommission]);

  const ownerPanel = isCreator ? (
    <CommissionOwnerPanel
      commission={localCommission}
      isPublishing={isPublishing}
      isUnpublishing={isUnpublishing}
      isDeleting={isDeleting}
      variant="inline"
      onPublish={() => void handlePublish()}
      onUnpublish={() => void handleUnpublish()}
      onDelete={() => setIsDeleteModalOpen(true)}
      onUploadResult={() =>
        navigate('/create-post', {
          state: { crowdCommissionId: localCommission.id, isPollCommission: true },
        })
      }
    />
  ) : undefined;

  return (
    <>
      <PollCard
        title={localCommission.title}
        caption={localCommission.caption}
        creatorName={creatorName}
        creatorAvatarUrl={creatorAvatarUrl ?? null}
        creatorProfileUrl={creatorProfileUrl}
        heroImageUrl={heroImageUrl}
        status={localCommission.status}
        options={options.map((opt) => ({
          id: opt.id,
          text: opt.text,
          imageUrl: opt.imageUrl
            ? getCrowdCommissionImageUrl(commission.creatorId, commission.id, opt.imageUrl)
            : null,
          voteCount: opt.voteCount,
          voterCount: opt.voterCount,
          displayOrder: opt.displayOrder,
        }))}
        totalWeightedVotes={pollResults?.totalWeightedVotes ?? 0}
        totalVoters={pollResults?.totalVoters ?? 0}
        totalCollectedCents={
          pollResults?.totalCollectedCents ?? localCommission.totalCollectedCents
        }
        userVotedOptionId={pollResults?.userVote?.optionId ?? null}
        userVoteStatus={pollResults?.userVote?.status ?? null}
        userVoteSessionUrl={pollResults?.userVote?.sessionUrl ?? null}
        winnerOptionId={localCommission.winnerOptionId}
        deadlineAt={localCommission.fundingDeadlineAt ?? null}
        variant={variant}
        isCreator={isCreator}
        onCheckout={handleCheckout}
        onVote={handleVote}
        onPickWinner={pickWinner}
        onOpen={onNavigate ?? (() => setIsModalOpen(true))}
      />

      <CrowdCommissionPollModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        commission={localCommission}
        pollResults={pollResults}
        isCreator={isCreator}
        ownerPanel={ownerPanel}
        onCheckout={handleCheckout}
        onVote={handleVote}
        onPickWinner={pickWinner}
      />

      <CrowdCommissionConfirmModal
        variant="delete"
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={() => void handleConfirmDelete()}
        isLoading={isDeleting}
        commissionStatus={localCommission.status}
      />
    </>
  );
}
