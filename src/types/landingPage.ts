// Landing Page için type definitions

export interface HeroSection {
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  backgroundImage: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface StatsSection {
  stats: StatItem[];
  backgroundColor: string;
  textColor: string;
}

export interface PremiumSection {
  title: string;
  description: string;
  features: Array<{
    title: string;
    description: string;
  }>;
  backgroundImage: string;
}

export interface ComparisonTableRow {
  criterion: string;
  istanbul: string;
  cyprus: string;
}

export interface ComparisonSection {
  title: string;
  subtitle: string;
  tableHeaders: {
    criterion: string;
    istanbul: string;
    cyprus: string;
  };
  tableRows: ComparisonTableRow[];
  footerNote: string;
}

export interface CompanySection {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  backgroundImage: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSection {
  title: string;
  subtitle: string;
  faqs: FAQItem[];
}

export interface CTASection {
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  footerText: string;
}

export interface FamilyFeaturesSection {
  title: string;
  subtitle: string;
  features: Array<{
    title: string;
    description: string;
  }>;
  bottomQuote: string;
}

export interface EducationSection {
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  advantages: Array<{
    title: string;
    items: string[];
    quote: string;
  }>;
}

export interface PaymentSystemSection {
  title: string;
  subtitle: string;
  paymentOptions: Array<{
    title: string;
    description: string;
    borderColor: string;
  }>;
  bottomQuote: string;
}

export interface CustomerStorySection {
  title: string;
  subtitle: string;
  quote: string;
  author: string;
  backgroundImage: string;
}

export interface LandingPageFormData {
  name: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  
  // Landing Page Sections
  hero: HeroSection;
  stats: StatsSection;
  premium: PremiumSection;
  comparison: ComparisonSection;
  company: CompanySection;
  faq: FAQSection;
  cta: CTASection;
  familyFeatures: FamilyFeaturesSection;
  education: EducationSection;
  paymentSystem: PaymentSystemSection;
  customerStory: CustomerStorySection;
  
  // SEO Fields
  seoTitle?: string;
  seoDescription?: string;
  
  // Metadata
  tags: string[];
}

export interface LandingPage extends LandingPageFormData {
  id: string;
  createdAt: any; // Firebase Timestamp
  updatedAt: number; // Unix timestamp in milliseconds
  viewCount?: number;
  conversionCount?: number;
  publishedAt?: number;
}

export interface LandingPageListItem {
  id: string;
  name: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: any; // Firebase Timestamp
  updatedAt: number; // Unix timestamp in milliseconds
  viewCount?: number;
  conversionCount?: number;
} 