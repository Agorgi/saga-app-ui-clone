import { PollModal } from '@domains/crowd-commissions/ui/Poll';
import { StatusBadge } from '@domains/crowd-commissions/ui/StatusBadge/StatusBadge';
import { useProfilePicture } from '@hooks/useProfilePicture';
import { useUserProfile } from '@hooks/useUserProfile';
import type { CrowdCommission, PollResultsResponse } from '@saga/crowd-commission-middleware';
import { getCrowdCommissionImageUrl } from '@utils/getImageUrls';
import type { ReactNode } from 'react';

interface CrowdCommissionPollModalProps {
  isOpen: boolean;
  onClose: () => void;
  commission: CrowdCommission;
  pollResults: PollResultsResponse | undefined;
  isCreator: boolean;
  ownerPanel?: ReactNode;
  onCheckout: (amountCents: number) => void;
  onVote: (optionId: string) => void;
  onPickWinner: (optionId: string) => void;
}

export function CrowdCommissionPollModal({
  isOpen,
  onClose,
  commission,
  pollResults,
  isCreator,
  ownerPanel,
  onCheckout,
  onVote,
  onPickWinner,
}: CrowdCommissionPollModalProps) {
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

  return (
    <PollModal
      isOpen={isOpen}
      onClose={onClose}
      title={commission.title}
      caption={commission.caption}
      creatorName={creatorName}
      creatorAvatarUrl={creatorAvatarUrl ?? null}
      creatorProfileUrl={creatorProfileUrl}
      heroImageUrl={heroImageUrl}
      status={commission.status}
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
      totalCollectedCents={pollResults?.totalCollectedCents ?? commission.totalCollectedCents}
      userVotedOptionId={pollResults?.userVote?.optionId ?? null}
      userVoteStatus={pollResults?.userVote?.status ?? null}
      userVoteSessionUrl={pollResults?.userVote?.sessionUrl ?? null}
      winnerOptionId={commission.winnerOptionId}
      deadlineAt={commission.fundingDeadlineAt ?? null}
      isCreator={isCreator}
      statusBadge={<StatusBadge status={commission.status} />}
      ownerPanel={ownerPanel}
      onCheckout={onCheckout}
      onVote={onVote}
      onPickWinner={onPickWinner}
    />
  );
}
