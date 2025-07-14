'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createLandingPage, getDefaultLandingPageData } from '@/lib/landingPageService';
import { LandingPageFormData } from '@/types/landingPage';
import LandingPageEditor from '@/components/landingPage/LandingPageEditor';

export default function NewLandingPagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default data ile landing page form data'sını initialize et
  const [formData, setFormData] = useState<LandingPageFormData>(() => {
    const defaultData = getDefaultLandingPageData();
    return {
      name: '',
      slug: '',
      ...defaultData
    };
  });

  const handleSave = async (data: LandingPageFormData, isDraft: boolean = true) => {
    try {
      setLoading(true);
      setError(null);

      // Eğer name boşsa otomatik isim ver
      const finalName = data.name.trim() || `Landing Page ${Date.now()}`;

      // Status'u set et
      const finalData = {
        ...data,
        name: finalName,
        status: isDraft ? 'draft' as const : 'published' as const
      };

      const lpId = await createLandingPage(finalData);
      console.log('✅ Landing Page oluşturuldu:', lpId);
      
      // Landing page listesine yönlendir
      router.push('/landing-pages');
    } catch (err) {
      console.error('❌ Landing Page oluşturma hatası:', err);
      setError(err instanceof Error ? err.message : 'Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    // Preview için temporary data kullan
    console.log('🔍 Preview data:', formData);
    // Bu işlevsellik daha sonra implement edilebilir
    alert('Preview özelliği yakında eklenecek!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/landing-pages')}
                className="text-gray-600 hover:text-gray-800 flex items-center space-x-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Landing Pages</span>
              </button>
              <div className="w-px h-6 bg-gray-300"></div>
              
            </div>
            
            <div className="flex items-center space-x-3">
           
              <button
                onClick={() => handleSave(formData, true)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                {loading ? 'Kaydediliyor...' : '💾 Taslak Kaydet'}
              </button>
              <button
                onClick={() => handleSave(formData, false)}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
              >
                {loading ? 'Yayınlanıyor...' : '🚀 Yayınla'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Main Editor */}
      <main className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        <LandingPageEditor
          data={formData}
          onChange={setFormData}
          isLoading={loading}
        />
      </main>

      {/* Save Reminder */}
     
    </div>
  );
} 