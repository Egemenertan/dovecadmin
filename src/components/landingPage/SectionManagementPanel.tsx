'use client';

import React from 'react';
import { LandingPageFormData } from '@/types/landingPage';

interface SectionManagementPanelProps {
  data: LandingPageFormData;
  onChange: (data: LandingPageFormData) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function SectionManagementPanel({
  data,
  onChange,
  isOpen,
  onToggle
}: SectionManagementPanelProps) {
  const allSections = [
    'hero', 'stats', 'premium', 'comparison', 'company', 
    'faq', 'cta', 'familyFeatures', 'education', 'paymentSystem', 'customerStory'
  ];

  const getSectionTitle = (sectionId: string) => {
    const titles: { [key: string]: string } = {
      'hero': 'Hero',
      'stats': 'İstatistikler', 
      'premium': 'Premium İçerik',
      'comparison': 'Karşılaştırma',
      'company': 'Şirket',
      'faq': 'SSS',
      'cta': 'Son Çağrı',
      'familyFeatures': 'Aile Özellikleri',
      'education': 'Eğitim',
      'paymentSystem': 'Ödeme Sistemi',
      'customerStory': 'Müşteri Hikayesi'
    };
    return titles[sectionId] || sectionId;
  };

  const hiddenSections = data.hiddenSections || [];
  const visibleSections = allSections.filter(sectionId => !hiddenSections.includes(sectionId));
  const currentHiddenSections = allSections.filter(sectionId => hiddenSections.includes(sectionId));

  // Section'ı geri getir
  const restoreSection = (sectionId: string) => {
    const newHiddenSections = hiddenSections.filter(id => id !== sectionId);
    onChange({
      ...data,
      hiddenSections: newHiddenSections
    });
  };

  // Tüm section'ları geri getir
  const restoreAllSections = () => {
    onChange({
      ...data,
      hiddenSections: []
    });
  };

  // Section'ı duplicate et
  const duplicateSection = (sectionId: string) => {
    const duplicates = data.duplicatedSections || {};
    const currentDuplicates = duplicates[sectionId] || [];
    const sectionData = (data as any)[sectionId];
    
    onChange({
      ...data,
      duplicatedSections: {
        ...duplicates,
        [sectionId]: [...currentDuplicates, { ...sectionData, _duplicateId: Date.now() }]
      }
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-4 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 text-black p-3 rounded-l-lg shadow-lg z-50 transition-colors"
        title="Section Yönetimi"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200 z-50 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Section Yönetimi</h3>
          <button
            onClick={onToggle}
            className="p-1 text-gray-500 hover:text-gray-700 rounded transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Visible Sections */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Aktif Section'lar ({visibleSections.length})</h4>
          <div className="space-y-2">
            {visibleSections.map((sectionId, index) => {
              const duplicateCount = (data.duplicatedSections?.[sectionId] || []).length;
              return (
                <div key={sectionId} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">{getSectionTitle(sectionId)}</span>
                    {duplicateCount > 0 && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        +{duplicateCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                    <button
                      onClick={() => duplicateSection(sectionId)}
                      className="p-1 text-green-600 hover:text-green-700 hover:bg-green-100 rounded transition-colors"
                      title="Çoğalt"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hidden Sections */}
        {currentHiddenSections.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Gizli Section'lar ({currentHiddenSections.length})</h4>
              <button
                onClick={restoreAllSections}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Tümünü Geri Getir
              </button>
            </div>
            <div className="space-y-2">
              {currentHiddenSections.map((sectionId) => (
                <div key={sectionId} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">{getSectionTitle(sectionId)}</span>
                  </div>
                  <button
                    onClick={() => restoreSection(sectionId)}
                    className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                    title="Geri Getir"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>💡 Nasıl Kullanılır:</strong>
          </p>
          <ul className="text-xs text-yellow-700 mt-2 space-y-1">
            <li>• Section üzerine gelince sağ üstte kontroller görünür</li>
            <li>• ↑↓ butonları ile sıralama yapabilirsiniz</li>
            <li>• 📋 butonu ile section kopyalayabilirsiniz</li>
            <li>• 🗑️ butonu ile section'ı gizleyebilirsiniz</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 