export interface BlogFormData {
  title: string;
  en_title: string;
  pl_title: string;
  excerpt: string;
  en_excerpt: string;
  pl_excerpt: string;
  content: string;
  en_content: string;
  pl_content: string;
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
  reading_time?: number; // Okuma süresi (dakika)
  view_count?: number; // Görüntüleme sayısı
  like_count?: number; // Beğeni sayısı
  seo_title?: string; // SEO başlık
  seo_description?: string; // SEO açıklama
  published_at?: number; // Yayınlanma tarihi
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  en_title: string;
  pl_title: string;
  excerpt: string;
  en_excerpt: string;
  pl_excerpt: string;
  content: string;
  en_content: string;
  pl_content: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  coverImage: string;
  createdAt: any; // Firebase Timestamp
  updatedAt: number; // Unix timestamp in milliseconds
  oldSlugs: string[];
  reading_time?: number; // Okuma süresi (dakika)
  view_count?: number; // Görüntüleme sayısı
  like_count?: number; // Beğeni sayısı
  seo_title?: string; // SEO başlık
  seo_description?: string; // SEO açıklama
  published_at?: number; // Yayınlanma tarihi
}

export interface BlogListItem {
  id: string;
  slug: string;
  title: string;
  en_title: string;
  pl_title: string;
  excerpt: string;
  en_excerpt: string;
  pl_excerpt: string;
  status: 'draft' | 'published' | 'archived';
  coverImage: string;
  createdAt: any; // Firebase Timestamp
  updatedAt: number; // Unix timestamp in milliseconds
  oldSlugs: string[];
} 