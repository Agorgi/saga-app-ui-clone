import { useAuth } from '@domains/auth';
import { useCrowdCommission } from '@domains/crowd-commissions/hooks/useCrowdCommission';
import {
  useDeleteCrowdCommission,
  usePublishCrowdCommission,
  useUnpublishCrowdCommission,
} from '@domains/crowd-commissions/hooks/useCrowdCommissionMutations';
import { usePickWinner } from '@domains/crowd-commissions/hooks/usePickWinner';
import { usePollResults } from '@domains/crowd-commissions/hooks/usePollResults';
import { usePollCheckout, usePollVote } from '@domains/crowd-commissions/hooks/usePollVote';
import { CommissionDetailSheet } from '@domains/crowd-commissions/ui/CommissionDetailSheet/CommissionDetailSheet';
import { CommissionOwnerPanel } from '@domains/crowd-commissions/ui/CommissionOwnerPanel/CommissionOwnerPanel';
import { CrowdCommissionPollModal } from '@domains/crowd-commissions/ui/CrowdCommissionPollModal/CrowdCommissionPollModal';
import { CrowdCommissionConfirmModal } from '@domains/crowd-commissions/ui/Modals/CrowdCommissionConfirmModal';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommissionBadge } from './CommissionBadge';

interface CommissionModalLayerProps {
  readonly commissionId: string;
  readonly onClose: () => void;
}

function CommissionModalLayer({ commissionId, onClose }: CommissionModalLayerProps) {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const { commission, loading, error, refetch } = useCrowdCommission(commissionId);
  const { data: pollResults, refetch: refetchPollResults } = usePollResults(commissionId);
  const { startCheckout, isRedirecting } = usePollCheckout(commissionId);
  const { castVote } = usePollVote(commissionId);
  const { pickWinner } = usePickWinner(commissionId, refetchPollResults);

  const { execute: publishCommission, isLoading: isPublishing } = usePublishCrowdCommission();
  const { execute: unpublishCommission, isLoading: isUnpublishing } = useUnpublishCrowdCommission();
  const { execute: deleteCommission, isLoading: isDeleting } = useDeleteCrowdCommission();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleCheckout = useCallback(
    (amountCents: number) => {
      if (!isRedirecting) void startCheckout(amountCents);
    },
    [startCheckout, isRedirecting],
  );

  const handleVote = useCallback(
    async (optionId: string) => {
      await castVote(optionId);
      void refetchPollResults();
    },
    [castVote, refetchPollResults],
  );

  const handleConfirmDelete = useCallback(async () => {
    const deleted = await deleteCommission(commissionId);
    if (deleted) {
      setIsDeleteModalOpen(false);
      onClose();
    }
  }, [commissionId, deleteCommission, onClose]);

  if (loading || error !== undefined || !commission) return null;

  if (commission.commissionType !== 'poll') {
    return <CommissionDetailSheet isOpen={true} onClose={onClose} commission={commission} />;
  }

  const isCreator = userId !== undefined && userId === commission.creatorId;

  const ownerPanel = isCreator ? (
    <CommissionOwnerPanel
      commission={commission}
      isPublishing={isPublishing}
      isUnpublishing={isUnpublishing}
      isDeleting={isDeleting}
      variant="inline"
      onPublish={async () => {
        await publishCommission(commission.id);
        await refetch();
      }}
      onUnpublish={async () => {
        await unpublishCommission(commission.id);
        await refetch();
      }}
      onDelete={() => setIsDeleteModalOpen(true)}
      onUploadResult={() =>
        navigate('/create-post', {
          state: { crowdCommissionId: commission.id, isPollCommission: true },
        })
      }
    />
  ) : undefined;

  return (
    <>
      <CrowdCommissionPollModal
        isOpen={true}
        onClose={onClose}
        commission={commission}
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
        commissionStatus={commission.status}
      />
    </>
  );
}

interface CommissionBadgeModalProps {
  readonly crowdCommissionId: string;
  readonly variant: 'overlay' | 'inline';
}

export function CommissionBadgeModal({ crowdCommissionId, variant }: CommissionBadgeModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <CommissionBadge
        crowdCommissionId={crowdCommissionId}
        variant={variant}
        onOpen={() => setIsOpen(true)}
      />
      {isOpen && (
        <CommissionModalLayer commissionId={crowdCommissionId} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
