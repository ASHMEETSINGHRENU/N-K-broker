export const PROPERTY_TYPES = [
  'Apartment',
  'Villa',
  'Townhouse',
  'Penthouse',
  'Compound',
  'Duplex',
  'Full Floor',
  'Half Floor',
  'Whole Building',
  'Bulk Rent Unit',
  'Bungalow',
  'Hotel & Hotel Apartment',
  'Mansion',
  'Branded Residence'
] as const;

export const LUXURY_COLLECTIONS = [
  'Waterfront Villas',
  'Private Residences',
  'Dubai Penthouse Collection',
  'Branded Residences',
  'Investment Properties',
  'Ultra-Luxury Mansions'
] as const;

export const PROPERTY_PURPOSES = ['BUY', 'RENT', 'OFF_PLAN'] as const;

export const COMPLETION_STATUSES = ['READY', 'OFF_PLAN', 'UNDER_CONSTRUCTION'] as const;

export const FURNISHING_STATUSES = [
  'UNFURNISHED',
  'SEMI_FURNISHED',
  'FURNISHED',
  'DESIGNER_FURNISHED'
] as const;
