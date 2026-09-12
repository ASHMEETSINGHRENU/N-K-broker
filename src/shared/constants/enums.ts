export const USER_ROLES = ['CLIENT', 'BROKER', 'ADMIN'] as const;

export const LISTING_STATUSES = [
  'DRAFT',
  'PENDING_APPROVAL',
  'ACTIVE',
  'INACTIVE',
  'SOLD',
  'RENTED'
] as const;

export const LEAD_STATUSES = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'VIEWING',
  'NEGOTIATION',
  'CONVERTED',
  'LOST'
] as const;

export const LEAD_SOURCES = [
  'WEBSITE',
  'GOOGLE',
  'INSTAGRAM',
  'FACEBOOK',
  'YOUTUBE',
  'REFERRAL',
  'DIRECT',
  'CAMPAIGN',
  'OTHER'
] as const;

export const VIEWING_STATUSES = [
  'REQUESTED',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
  'RESCHEDULED'
] as const;

export const COMMISSION_STATUSES = [
  'PENDING',
  'APPROVED',
  'PAID',
  'DISPUTED'
] as const;

export const INSIGHT_CATEGORIES = [
  'Dubai Market',
  'Investment',
  'Communities',
  'Buying Guide',
  'Renting Guide',
  'Developer Updates',
  'Property Trends',
  'Luxury Lifestyle'
] as const;
