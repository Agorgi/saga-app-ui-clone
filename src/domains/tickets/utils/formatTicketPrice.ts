/**
 * Formats a ticket price for display.
 * Returns "Free" for zero-price tickets, otherwise formats as a locale currency string.
 * Falls back to a raw value if the currency code is invalid.
 */
export function formatTicketPrice(priceCents: number, currency: string): string {
  if (priceCents === 0) return 'Free';
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(priceCents / 100);
  } catch {
    return `${(priceCents / 100).toFixed(2)} ${currency}`;
  }
}
