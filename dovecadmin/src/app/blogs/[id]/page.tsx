'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlogPost } from '@/types/blog';
import { getBlogById, incrementViewCount } from '@/lib/blogService';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BlogDetailPage(props: PageProps) {
  const params = React.use(props.params);
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Blog ID:', params.id);
        
        // Firebase'den blog getir
        const blogData = await getBlogById(params.id);
        
        if (!blogData) {
          throw new Error('Blog bulunamadı');
        }
        
        setBlog(blogData);
        
        // Görüntüleme sayısını artır (background'da)
        incrementViewCount(params.id).catch(err => 
          console.warn('View count update failed:', err)
        );
        
      } catch (err) {
        console.error('Blog yükleme hatası:', err);
        setError(err instanceof Error ? err.message : 'Blog yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBlog();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Blog yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error || 'Blog bulunamadı'}
          </div>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/blogs')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Blog Listesine Dön
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/blogs')}
              className="text-gray-600 hover:text-gray-800 flex items-center"
            >
              ← Blog Listesine Dön
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/blogs/edit/${blog.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Düzenle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Featured Image */}
        {blog.coverImage && (
          <div className="mb-8">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Blog Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              blog.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : blog.status === 'draft'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {blog.status === 'published' ? 'Yayınlanmış' : 
               blog.status === 'draft' ? 'Taslak' : 'Arşivlenmiş'}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>

          {blog.en_title && (
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              {blog.en_title}
            </h2>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <span>📅 {blog.createdAt?.toDate ? blog.createdAt.toDate().toLocaleDateString('tr-TR') : new Date(blog.createdAt).toLocaleDateString('tr-TR')}</span>
            {blog.tags && blog.tags.length > 0 && (
              <span>🏷️ {blog.tags.join(', ')}</span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <span>⏱️ {blog.reading_time} dakika okuma</span>
            {blog.view_count !== undefined && <span>👁️ {blog.view_count} görüntüleme</span>}
            {blog.like_count !== undefined && <span>❤️ {blog.like_count} beğeni</span>}
          </div>

          <p className="text-xl text-gray-700 leading-relaxed">
            {blog.excerpt}
          </p>
        </header>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Etiketler</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Blog Content */}
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        {/* English Content */}
        {blog.en_content && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">English Version</h2>
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: blog.en_content }} />
            </div>
          </div>
        )}

        {/* SEO Info */}
        {(blog.seo_title || blog.seo_description) && (
          <section className="mb-8 p-6 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🔍 SEO Bilgileri</h3>
            {blog.seo_title && (
              <div className="mb-3">
                <strong className="text-gray-700">SEO Başlık:</strong>
                <p className="text-gray-600">{blog.seo_title}</p>
              </div>
            )}
            {blog.seo_description && (
              <div>
                <strong className="text-gray-700">SEO Açıklama:</strong>
                <p className="text-gray-600">{blog.seo_description}</p>
              </div>
            )}
          </section>
        )}

        {/* Meta Info */}
        <section className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-sm text-gray-500 space-y-2">
            <p><strong>Oluşturulma:</strong> {blog.createdAt?.toDate ? blog.createdAt.toDate().toLocaleString('tr-TR') : new Date(blog.createdAt).toLocaleString('tr-TR')}</p>
            <p><strong>Son Güncelleme:</strong> {new Date(blog.updatedAt).toLocaleString('tr-TR')}</p>
            {blog.published_at && (
              <p><strong>Yayınlanma:</strong> {new Date(blog.published_at).toLocaleString('tr-TR')}</p>
            )}
            <p><strong>Slug:</strong> {blog.slug}</p>
            <p><strong>Blog ID:</strong> {blog.id}</p>
          </div>
        </section>
      </article>
    </div>
  );
} 