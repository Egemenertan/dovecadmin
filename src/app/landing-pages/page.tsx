'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LandingPageListItem } from '@/types/landingPage';
import { subscribeToLandingPages, deleteLandingPage } from '@/lib/landingPageService';
import LandingPageCard from '@/components/LandingPageCard';

export default function LandingPageListPage() {
  const [landingPages, setLandingPages] = useState<LandingPageListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  // Firebase'den landing page'leri real-time olarak yükle
  useEffect(() => {
    console.log('🚀 LandingPageListPage: useEffect starting...');
    let unsubscribe: (() => void) | null = null;

    const startListening = () => {
      try {
        console.log('🔥 LandingPageListPage: Starting Firebase listener...');
        setLoading(true);
        setError(null);
        
        // Real-time listener başlat
        unsubscribe = subscribeToLandingPages((lpData) => {
          console.log('📊 LandingPageListPage: Received LP data:', lpData);
          console.log('📈 LandingPageListPage: Number of LPs:', lpData.length);
          setLandingPages(lpData);
          setLoading(false);
        });
        
        console.log('✅ LandingPageListPage: Firebase listener started successfully');
      } catch (err) {
        console.error('❌ LandingPageListPage: Error starting listener:', err);
        setError('Firebase Firestore bağlantısı kurulamadı. Lütfen internet bağlantınızı kontrol edin.');
        setLoading(false);
      }
    };

    startListening();

    // Cleanup function
    return () => {
      console.log('🧹 LandingPageListPage: Cleaning up Firebase listener...');
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleDeleteLP = async (id: string, name: string) => {
    if (!window.confirm(`"${name}" adlı landing page'i silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      setDeleting(id);
      await deleteLandingPage(id);
      console.log('✅ Landing Page silindi:', id);
    } catch (error) {
      console.error('❌ Landing Page silme hatası:', error);
      alert('Landing Page silinirken bir hata oluştu');
    } finally {
      setDeleting(null);
    }
  };

  const getFilterCount = (status: string) => {
    if (status === 'all') return landingPages.length;
    return landingPages.filter(lp => lp.status === status).length;
  };

  const filteredLPs = filter === 'all' 
    ? landingPages 
    : landingPages.filter(lp => lp.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-200 rounded-full animate-pulse mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Landing Page'ler Yükleniyor...</h2>
          <p className="text-slate-600">Firebase'den veriler alınıyor</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 bg-red-500 rounded-full"></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Bağlantı Hatası</h2>
          <div className="bg-white border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8">
            {error}
          </div>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Tekrar Dene
            </button>
            <Link
              href="/landing-pages/new"
              className="text-slate-600 hover:text-slate-900 px-6 py-3 font-medium transition-colors"
            >
              Yeni LP Oluştur
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-2xl font-bold text-slate-900 hover:text-slate-700 transition-colors">
                DOVEC
              </Link>
              <p className="text-slate-600 mt-2 font-light">Landing Page Yönetimi</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/landing-pages/new"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New LP
              </Link>
              <Link
                href="/"
                className="text-slate-600 hover:text-slate-900 px-6 py-3 font-medium transition-colors"
              >
                Ana Sayfa
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-3">Landing Pages</h1>
              <p className="text-slate-600 font-light">Dinamik landing page'lerinizi yönetin</p>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full text-sm border border-yellow-200">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Live</span>
            </div>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex items-center space-x-2 mb-8">
            {[
              { key: 'all', label: 'Tüm LP\'ler' },
              { key: 'published', label: 'Yayınlanmış' },
              { key: 'draft', label: 'Taslak' },
              { key: 'archived', label: 'Arşivlenmiş' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  filter === tab.key
                    ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200'
                }`}
              >
                {tab.label}
                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-black/10">
                  {getFilterCount(tab.key)}
                </span>
              </button>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-slate-900 mb-1">{landingPages.length}</div>
              <div className="text-slate-600 font-light">Toplam LP</div>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-emerald-600 mb-1">{getFilterCount('published')}</div>
              <div className="text-slate-600 font-light">Yayınlanmış</div>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-amber-600 mb-1">{getFilterCount('draft')}</div>
              <div className="text-slate-600 font-light">Taslak</div>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-slate-500 mb-1">{getFilterCount('archived')}</div>
              <div className="text-slate-600 font-light">Arşivlenmiş</div>
            </div>
          </div>
        </div>

        {/* Landing Page List */}
        {filteredLPs.length > 0 ? (
          <div className="space-y-8">
            {filteredLPs.map((lp) => (
              <LandingPageCard
                key={lp.id}
                landingPage={lp}
                showActions={true}
                onDelete={() => handleDeleteLP(lp.id, lp.name)}
                isDeleting={deleting === lp.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              {filter === 'all' ? 'Henüz landing page bulunamadı' : `${filter} durumunda LP bulunamadı`}
            </h3>
            <p className="text-slate-600 font-light mb-8 max-w-md mx-auto leading-relaxed">
              {filter === 'all' 
                ? 'Firebase Firestore veritabanınızda landing page bulunmuyor. İlk landing page\'inizi oluşturun.'
                : `${filter} durumunda landing page bulunmuyor. Başka bir filtre seçin veya yeni bir LP oluşturun.`
              }
            </p>
            <div className="space-x-4">
              <Link
                href="/landing-pages/new"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Yeni Landing Page Oluştur
              </Link>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="text-slate-600 hover:text-slate-900 px-8 py-4 font-medium transition-colors border border-slate-200 rounded-xl hover:border-slate-300"
                >
                  Tüm LP'leri Göster
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer Status */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-center">
          <p className="text-slate-500 font-light">
            Toplam {landingPages.length} landing page • Real-time Firebase sync aktif
          </p>
        </div>
      </main>
    </div>
  );
} 