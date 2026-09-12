import { IUser } from './user.types.js';

export interface IClient {
  _id: string;
  user?: string | IUser;
  name: string;
  email: string;
  mobile: string;
  nationality?: string;
  residenceCountry?: string;
  buyingIntent: 'BUY' | 'RENT' | 'INVEST' | 'OFF_PLAN';
  budgetMinAED: number;
  budgetMaxAED: number;
  preferredLocations: string[];
  preferredBedrooms: number[];
  assignedBroker?: string;
  notes: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
