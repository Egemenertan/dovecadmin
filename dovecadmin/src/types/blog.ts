export interface BlogFormData {
  title: string;
  en_title: string;
  excerpt: string;
  en_excerpt: string;
  content: string;
  en_content: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  coverImage: string;
}

export interface Blog extends BlogFormData {
  id: string;
  slug: string;
  createdAt: any; // Firebase Timestamp
  updatedAt: number; // Unix timestamp in milliseconds
  oldSlugs: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  en_title: string;
  excerpt: string;
  en_excerpt: string;
  content: string;
  en_content: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  coverImage: string;
  createdAt: any; // Firebase Timestamp
  updatedAt: number; // Unix timestamp in milliseconds
  oldSlugs: string[];
}

export interface BlogListItem {
  id: string;
  slug: string;
  title: string;
  en_title: string;
  excerpt: string;
  en_excerpt: string;
  status: 'draft' | 'published' | 'archived';
  coverImage: string;
  createdAt: any; // Firebase Timestamp
  updatedAt: number; // Unix timestamp in milliseconds
  oldSlugs: string[];
} 