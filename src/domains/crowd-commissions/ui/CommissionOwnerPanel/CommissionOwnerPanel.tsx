import type { CrowdCommission } from '@saga/crowd-commission-middleware';
import { CrowdCommissionStatus } from '@saga/crowd-commission-middleware';
import { assertNever } from '@saga/precedent-middleware';
import { InfoCircle } from '@untitledui/icons';
import { Link } from 'react-router-dom';
import styles from './CommissionOwnerPanel.module.scss';

function getOwnerHint(status: CrowdCommission['status']): string {
  switch (status) {
    case CrowdCommissionStatus.DRAFT:
      return "Your commission is saved as a draft. Publish it when you're ready to start collecting pledges.";
    case CrowdCommissionStatus.ACTIVE:
      return 'Your commission is live and accepting pledges.';
    case CrowdCommissionStatus.LOCKING:
      return 'Pledges are being finalised. This process is automatic.';
    case CrowdCommissionStatus.PENDING_WINNER:
      return 'Your poll ended in a tie. Select the winning option to complete the commission.';
    case CrowdCommissionStatus.PENDING_RESULT:
      return 'Funding is complete. Upload your finished work to release funds.';
    case CrowdCommissionStatus.COMPLETED:
      return 'Commission delivered and funds disbursed.';
    case CrowdCommissionStatus.FAILED:
      return 'The commission did not meet its goal. All backers have been refunded.';
    default:
      return assertNever(status);
  }
}

interface CommissionOwnerPanelProps {
  commission: CrowdCommission;
  isPublishing: boolean;
  isUnpublishing: boolean;
  isDeleting: boolean;
  /** 'card' (default) renders as a standalone elevated card. 'inline' strips the outer card shell for embedding inside modals or panels. */
  variant?: 'card' | 'inline';
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
  onUploadResult: () => void;
}

export function CommissionOwnerPanel({
  commission,
  isPublishing,
  isUnpublishing,
  isDeleting,
  variant = 'card',
  onPublish,
  onUnpublish,
  onDelete,
  onUploadResult,
}: CommissionOwnerPanelProps) {
  const hint = getOwnerHint(commission.status);

  const isDraft = commission.status === CrowdCommissionStatus.DRAFT;
  const isActive = commission.status === CrowdCommissionStatus.ACTIVE;
  const isPendingResult = commission.status === CrowdCommissionStatus.PENDING_RESULT;
  const isCompleted = commission.status === CrowdCommissionStatus.COMPLETED;
  const isFailed = commission.status === CrowdCommissionStatus.FAILED;
  const isEditable = isDraft || isActive;
  const isDeletable = isDraft || isActive || isFailed;

  const rootClass = variant === 'inline' ? styles.ownerPanelInline : styles.ownerPanel;

  return (
    <div className={rootClass}>
      <div className={styles.ownerPanelBody}>
        <div className={styles.hintCallout}>
          <InfoCircle width={16} height={16} className={styles.hintCalloutIcon} />
          <p className={styles.hintCalloutText}>{hint}</p>
        </div>

        <div className={styles.panelActionRow}>
          {isCompleted && commission.resultPost != null && (
            <Link to={`/?post=${commission.resultPost.id}`} className={styles.panelBtnSecondary}>
              View Result Post
            </Link>
          )}
          {isDraft && (
            <button
              type="button"
              className={styles.panelBtnPrimary}
              onClick={onPublish}
              disabled={isPublishing}
            >
              {isPublishing ? 'Publishing…' : 'Publish commission'}
            </button>
          )}
          {isPendingResult && (
            <button type="button" className={styles.panelBtnPrimary} onClick={onUploadResult}>
              Upload finished work
            </button>
          )}
          {isEditable && (
            <Link
              to={`/crowd-commissions/${commission.id}/edit`}
              className={styles.panelBtnSecondary}
            >
              Edit details
            </Link>
          )}
          {isActive && (
            <button
              type="button"
              className={styles.panelBtnSecondary}
              onClick={onUnpublish}
              disabled={isUnpublishing}
            >
              {isUnpublishing ? 'Unpublishing…' : 'Unpublish'}
            </button>
          )}
        </div>
      </div>

      {isDeletable && (
        <div className={styles.dangerZone}>
          <button
            type="button"
            className={styles.panelBtnDanger}
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete commission'}
          </button>
        </div>
      )}
    </div>
  );
}
