'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LandingPageListItem, LandingPage } from '@/types/landingPage';
import { getLandingPageById } from '@/lib/landingPageService';
import LandingPagePreview from './landingPage/LandingPagePreview';

interface LandingPageCardProps {
  landingPage: LandingPageListItem;
  onDelete?: (id: string, name: string) => void;
  isDeleting?: boolean;
  showActions?: boolean;
}

export default function LandingPageCard({ 
  landingPage, 
  onDelete, 
  isDeleting, 
  showActions = true 
}: LandingPageCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<LandingPage | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const formatDate = (date: any) => {
    if (!date) return 'Tarih bulunamadı';
    
    try {
      const dateObj = date.toDate ? date.toDate() : new Date(date);
      return dateObj.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Geçersiz tarih';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'archived':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Yayınlanmış';
      case 'draft':
        return 'Taslak';
      case 'archived':
        return 'Arşivlenmiş';
      default:
        return 'Bilinmiyor';
    }
  };

  const getViewCount = () => {
    return landingPage.viewCount || 0;
  };

  const getConversionCount = () => {
    return landingPage.conversionCount || 0;
  };

  const handlePreviewClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setLoadingPreview(true);
      const data = await getLandingPageById(landingPage.id);
      if (data) {
        setPreviewData(data);
        setShowPreview(true);
      } else {
        alert('Landing page verisi bulunamadı');
      }
    } catch (error) {
      console.error('Preview yüklenirken hata:', error);
      alert('Önizleme yüklenirken bir hata oluştu');
    } finally {
      setLoadingPreview(false);
    }
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewData(null);
  };

  return (
    <>
      <article className="group bg-white border border-slate-200 rounded-2xl p-8 hover:border-yellow-300 hover:shadow-xl transition-all duration-500 ease-out">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(landingPage.status)}`}>
                {getStatusText(landingPage.status)}
              </span>
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-xs text-slate-500 font-medium">LANDING PAGE</span>
            </div>
            <time className="text-sm text-slate-500 font-light">
              {formatDate(landingPage.createdAt)}
            </time>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <Link href={`/landing-pages/${landingPage.id}`} className="block group-hover:text-slate-900 transition-colors">
              <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-2 group-hover:text-yellow-600 transition-colors">
                {landingPage.name}
              </h2>
              <p className="text-slate-600 text-sm">
                Slug: /{landingPage.slug}
              </p>
            </Link>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{getViewCount()} görüntüleme</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>{getConversionCount()} dönüşüm</span>
              </div>
            </div>
          </div>

          {/* Preview thumbnail */}
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 flex items-center justify-center group-hover:from-yellow-100 group-hover:to-yellow-200 transition-all duration-300">
              <div className="text-center">
                <svg className="w-12 h-12 text-yellow-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p className="text-sm text-yellow-600 font-medium">Landing Page Preview</p>
              </div>
            </div>
            
            {/* Status badge on preview */}
            <div className="absolute top-3 right-3">
              <div className={`px-2 py-1 text-xs font-medium rounded-md ${
                landingPage.status === 'published' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : landingPage.status === 'draft'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {getStatusText(landingPage.status)}
              </div>
            </div>
          </div>

          {/* Meta & Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-6 text-sm text-slate-500">
              <span>🎨 Landing Page</span>
              <span>📊 {getViewCount()} / {getConversionCount()}</span>
            </div>

            {showActions && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePreviewClick}
                  disabled={loadingPreview}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50 flex items-center space-x-1"
                >
                  {loadingPreview ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Yükleniyor...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Önizleme</span>
                    </>
                  )}
                </button>
                <Link
                  href={`/landing-pages/edit/${landingPage.id}`}
                  className="text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors"
                >
                  Düzenle
                </Link>
                {onDelete && (
                  <button
                    onClick={() => onDelete(landingPage.id, landingPage.name)}
                    disabled={isDeleting}
                    className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? 'Siliniyor...' : 'Sil'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Preview Modal */}
      {showPreview && previewData && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closePreview}
          ></div>

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{previewData.name} - Önizleme</h3>
                  <p className="text-sm text-gray-500">/{previewData.slug}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(previewData.status)}`}>
                    {getStatusText(previewData.status)}
                  </span>
                  <button
                    onClick={closePreview}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <LandingPagePreview 
                  data={previewData} 
                  activeSection={null}
                  onSectionClick={() => {}} 
                />
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>📊 {getViewCount()} görüntüleme</span>
                  <span>🎯 {getConversionCount()} dönüşüm</span>
                  <span>📅 {formatDate(previewData.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Link
                    href={`/landing-pages/edit/${previewData.id}`}
                    className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors"
                    onClick={closePreview}
                  >
                    Düzenle
                  </Link>
                  <button
                    onClick={closePreview}
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 