import { IUser } from './user.types.js';

export interface IBroker {
  _id: string;
  user: string | IUser;
  reraNumber: string; // Official Dubai Real Estate Regulatory Agency License
  brn: string;        // Broker Registration Number
  agencyName: string;
  title: string;
  photoUrl: string;
  bio: string;
  languages: string[];
  specializations: string[];
  experienceYears: number;
  totalSalesVolumeAED: number;
  commissionSplitPct: number; // e.g., 60 means 60% broker / 40% agency
  activeListingsCount: number;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  isActive: boolean;
  whatsappNumber?: string; // Only displayed through approved public channel or masked
  createdAt: Date;
  updatedAt: Date;
}
