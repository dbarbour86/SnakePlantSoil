export interface QuickAnswer {
  id: string;
  question: string;
  answer: string;
}

export interface ContentGuide {
  id: string;
  title: string;
  shortDescription: string;
  category: string;
  readTime: string;
  iconName: string;
  slug: string;
  date?: string;
  content?: string;
  status?: string;
}

export interface RecommendedProduct {
  id: string;
  name: string;
  brand: string;
  category: 'soil' | 'ammendment' | 'pot' | 'tool';
  imageUrl: string;
  bestFor: string;
  rating: number;
  description: string;
  pros: string[];
  cons: string[];
  linkText: string;
  priceEstimate: '$$' | '$$$' | '$';
  specs: { [key: string]: string };
  affiliateUrl?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SoilIngredient {
  id: string;
  name: string;
  description: string;
  baseDrainage: number; // 0 to 10
  baseRetention: number; // 0 to 10
  baseAeration: number; // 0 to 10
  purpose: string;
  percentage: number;
}
