/**
 * Format a number as luxury UAE Dirham (AED)
 * Examples:
 *   formatAED(25000000) -> "AED 25,000,000"
 *   formatAEDShort(25000000) -> "AED 25M"
 */
export function formatAED(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'AED 0';
  }
  return `AED ${Math.round(amount).toLocaleString('en-US')}`;
}

export function formatAEDShort(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'AED 0';
  }
  if (amount >= 1_000_000_000) {
    return `AED ${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `AED ${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `AED ${(amount / 1_000).toFixed(0)}K`;
  }
  return `AED ${amount.toLocaleString('en-US')}`;
}

export function formatSqFt(area: number): string {
  if (!area) return '0 sq.ft';
  return `${Math.round(area).toLocaleString('en-US')} sq.ft`;
}
