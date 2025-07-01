'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BlogForm from '@/components/blog/BlogForm';
import { BlogFormData } from '@/types/blog';
import { getBlogById, updateBlog } from '@/lib/blogService';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditBlogPage(props: PageProps) {
  const params = React.use(props.params);
  const router = useRouter();
  const [blogData, setBlogData] = useState<BlogFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Blog verilerini yükle
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Düzenlenecek Blog ID:', params.id);
        
        // Firebase'den blog getir
        const data = await getBlogById(params.id);
        
        if (!data) {
          throw new Error('Blog bulunamadı');
        }
        
        // Blog verisini form datası formatına çevir
        setBlogData({
          title: data.title,
          en_title: data.en_title,
          excerpt: data.excerpt,
          en_excerpt: data.en_excerpt,
          content: data.content,
          en_content: data.en_content,
          tags: data.tags || [],
          status: data.status,
          coverImage: data.coverImage || ''
        });
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

  const handleSubmit = async (formData: BlogFormData) => {
    try {
      setSaving(true);
      setError(null);

      console.log('Blog güncelleniyor:', formData);

      // Firebase'de blog güncelle
      await updateBlog(params.id, formData);

      console.log('Blog başarıyla güncellendi');

      // Başarılı güncelleme sonrası yönlendirme
      router.push('/blogs');
    } catch (err) {
      console.error('Blog güncelleme hatası:', err);
      setError(err instanceof Error ? err.message : 'Blog güncellenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
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

  if (!blogData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Blog bulunamadı</p>
          <button
            onClick={() => router.push('/blogs')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Blog Listesine Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Blog Düzenle</h1>
              <p className="text-gray-600 mt-1">Blog ID: {params.id}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/blogs/${params.id}`)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                👁️ Önizleme
              </button>
              <button
                onClick={() => router.push('/blogs')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                ← Blog Listesi
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-700 hover:text-red-900 font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {saving && (
          <div className="mb-6 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
              Blog Firebase'de güncelleniyor...
            </div>
          </div>
        )}

        {/* Blog Form */}
        <BlogForm
          initialData={blogData}
          onSubmit={handleSubmit}
          isLoading={saving}
        />
      </main>
    </div>
  );
} 