export type PropertyPurpose = 'BUY' | 'RENT' | 'OFF_PLAN';
export type ListingStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'INACTIVE' | 'SOLD' | 'RENTED';
export type CompletionStatus = 'READY' | 'OFF_PLAN' | 'UNDER_CONSTRUCTION';
export type FurnishingStatus = 'UNFURNISHED' | 'SEMI_FURNISHED' | 'FURNISHED' | 'DESIGNER_FURNISHED';
export type RentalFrequency = 'YEARLY' | 'MONTHLY' | 'WEEKLY' | 'DAILY';

export interface IPropertyAmenity {
  id: string;
  name: string;
  category: 'LUXURY' | 'WELLNESS' | 'SECURITY' | 'OUTDOOR' | 'ENTERTAINMENT' | 'SMART_HOME';
  icon?: string;
}

export interface IFloorPlan {
  title: string;
  bedrooms: number;
  bathrooms: number;
  totalAreaSqFt: number;
  imageUrl: string;
}

export interface INearbyPlace {
  name: string;
  category: 'LANDMARK' | 'BEACH' | 'AIRPORT' | 'METRO' | 'SCHOOL' | 'MALL';
  distanceMinutes: number;
}

export interface IProperty {
  _id: string;
  title: string;
  slug: string;
  referenceNumber: string;
  description: string;
  purpose: PropertyPurpose;
  propertyType: string; // 'Villa' | 'Penthouse' | 'Mansion' | 'Apartment' | 'Duplex' | 'Branded Residence'
  category: string;     // Reference to PropertyCategory
  priceAED: number;
  rentalFrequency?: RentalFrequency;
  serviceChargesAED?: number;
  bedrooms: number;
  bathrooms: number;
  builtUpAreaSqFt: number;
  plotAreaSqFt?: number;
  location: string;     // e.g. "Dubai"
  community: string;    // e.g. "Palm Jumeirah", "Downtown Dubai"
  subCommunity?: string;
  developer?: string;   // e.g. "Emaar", "Nakheel", "Omniyat"
  project?: string;
  furnishing: FurnishingStatus;
  completionStatus: CompletionStatus;
  handoverDate?: string;
  paymentPlan?: {
    downPaymentPct: number;
    duringConstructionPct: number;
    onHandoverPct: number;
    postHandoverPct?: number;
  };
  amenities: string[];
  images: string[];
  featuredImage: string;
  videoUrl?: string;
  virtualTourUrl?: string;
  floorPlans: IFloorPlan[];
  nearbyPlaces: INearbyPlace[];
  assignedBroker: any;
  status: ListingStatus;
  isFeatured: boolean;
  isNewLaunch: boolean;
  luxuryCollection?: string; // 'Waterfront Villas' | 'Private Residences' | 'Dubai Penthouse Collection'
  views: string[];           // 'Burj Khalifa View' | 'Arabian Gulf Sea View' | 'Golf Course View'
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}
