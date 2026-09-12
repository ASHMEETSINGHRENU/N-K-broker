export interface IWebsiteContent {
  _id?: string;
  hero: {
    headline: string;
    subheadline: string;
    backgroundImage: string;
    backgroundVideo?: string;
    ctaText: string;
    ctaLink: string;
  };
  featuredSectionTitle: string;
  featuredSectionSubtitle: string;
  consultationBanner: {
    title: string;
    description: string;
    buttonText: string;
    image: string;
  };
  announcementBanner?: {
    enabled: boolean;
    text: string;
    link?: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    officeAddress: string;
    reraRegistrationNumber: string;
    trnNumber: string;
    operatingHours: string;
  };
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    whatsapp?: string;
  };
  updatedAt: Date;
}

export interface ILocationEntity {
  _id: string;
  name: string;
  slug: string;
  headline: string;
  description: string;
  image: string;
  averagePricePerSqFtAED: number;
  featuredCommunities: string[];
  lifestyleTags: string[];
  totalActiveListings?: number;
}

export interface IDeveloperEntity {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  coverImage: string;
  description: string;
  establishedYear: number;
  flagshipProjects: string[];
  isVerified: boolean;
}
