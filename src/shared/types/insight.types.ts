export type InsightCategory =
  | 'Dubai Market'
  | 'Investment'
  | 'Communities'
  | 'Buying Guide'
  | 'Renting Guide'
  | 'Developer Updates'
  | 'Property Trends'
  | 'Luxury Lifestyle';

export interface IInsight {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown or rich HTML
  category: InsightCategory;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  readingTimeMinutes: number;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
