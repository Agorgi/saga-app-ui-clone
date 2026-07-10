import type { WireTicketTier } from '@/data/fixtures';
import { TicketQuantitySelector } from '@domains/tickets/components/TicketQuantitySelector/TicketQuantitySelector';
import { formatTicketPrice } from '@domains/tickets/utils/formatTicketPrice';
import { BaseModal } from '@saga/global-web';
import { XClose } from '@untitledui/icons';
import { useState } from 'react';
import styles from './EventTicketsModal.module.scss';

const MAX_PER_TIER = 8;

interface EventTicketsModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly tiers: readonly WireTicketTier[];
}

// Wireframe clone: the source opens a BottomSheet with TicketPurchaseSection,
// which computes a payment breakdown and starts a Stripe checkout. The clone has
// no payments backend, so this reproduces the ticket-selection UI (tiers, prices,
// per-tier quantity steppers, running subtotal) with an inert checkout button.
export function EventTicketsModal({ isOpen, onClose, tiers }: EventTicketsModalProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQuantityChange = (id: string, qty: number) =>
    setQuantities((prev) => ({ ...prev, [id]: qty }));

  const selected = Object.entries(quantities).filter(([, qty]) => qty > 0);
  const totalQty = selected.reduce((sum, [, qty]) => sum + qty, 0);
  const subtotalCents = selected.reduce((sum, [id, qty]) => {
    const tier = tiers.find((t) => t.id === id);
    return sum + (tier?.priceCents ?? 0) * qty;
  }, 0);
  const currency = tiers[0]?.currency ?? 'usd';

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="Get tickets"
      overlayClassName={styles.overlaySheet}
      className={styles.dialog}
    >
      <div className={styles.sheet}>
        <div className={styles.handle} aria-hidden="true" />

        <div className={styles.sheetHeader}>
          <h2 className={styles.sheetTitle}>Get tickets</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close tickets"
          >
            <XClose width={20} height={20} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.tierList}>
          {tiers.map((tier) => {
            const qty = quantities[tier.id] ?? 0;
            const soldOut = tier.available <= 0;

            return (
              <div
                key={tier.id}
                className={[styles.tier, soldOut ? styles.tierSoldOut : ''].filter(Boolean).join(' ')}
              >
                <div className={styles.tierInfo}>
                  <div className={styles.tierNameRow}>
                    <h3 className={styles.tierName}>{tier.name}</h3>
                    <span className={styles.tierPrice}>
                      {formatTicketPrice(tier.priceCents, tier.currency)}
                    </span>
                  </div>
                  {tier.description ? <p className={styles.tierDesc}>{tier.description}</p> : null}
                  {soldOut ? <p className={styles.soldOutText}>Sold out</p> : null}
                </div>

                {soldOut ? null : (
                  <TicketQuantitySelector
                    value={qty}
                    onChange={(value) => handleQuantityChange(tier.id, value)}
                    min={0}
                    max={Math.min(tier.available, MAX_PER_TIER)}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.footer}>
          <div className={styles.summary}>
            <span className={styles.summaryLabel}>
              {totalQty > 0 ? `${totalQty} ticket${totalQty === 1 ? '' : 's'}` : 'No tickets selected'}
            </span>
            <span className={styles.summaryTotal}>{formatTicketPrice(subtotalCents, currency)}</span>
          </div>

          <button type="button" className={styles.checkoutButton} disabled={totalQty === 0}>
            {totalQty > 0 ? 'Continue to checkout' : 'Select tickets'}
          </button>
          <p className={styles.previewNote}>Checkout is disabled in this preview.</p>
        </div>
      </div>
    </BaseModal>
  );
}
