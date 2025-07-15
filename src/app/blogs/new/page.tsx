'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BlogForm from '@/components/blog/BlogForm';
import { BlogFormData } from '@/types/blog';
import { createBlog } from '@/lib/blogService';

export default function NewBlogPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: BlogFormData) => {
    try {
      setSaving(true);
      setError(null);

      console.log('Yeni blog yazısı oluşturuluyor:', formData);
      
      // Firebase'de blog oluştur
      const newBlogId = await createBlog(formData);
      
      console.log('Blog başarıyla oluşturuldu, ID:', newBlogId);
      
      // Başarılı - blog listesine yönlendir
      router.push('/blogs');
      
    } catch (err) {
      console.error('Blog oluşturma hatası:', err);
      setError(err instanceof Error ? err.message : 'Blog oluşturulurken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Yeni Blog Yazısı</h1>
              <p className="text-gray-600 mt-1">Modern editör ile blog yazınızı oluşturun</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/blogs')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                ← Blog Listesi
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Ana Sayfa
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
              Blog yazısı Firebase'de kaydediliyor...
            </div>
          </div>
        )}

        {/* Info Banner */}
     

        {/* Blog Form */}
        <BlogForm
          onSubmit={handleSubmit}
          isLoading={saving}
        />
      </main>
    </div>
  );
} 