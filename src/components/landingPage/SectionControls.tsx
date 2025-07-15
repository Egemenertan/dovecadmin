'use client';

import React from 'react';
import { LandingPageFormData } from '@/types/landingPage';

interface SectionControlsProps {
  sectionId: string;
  sectionTitle: string;
  data: LandingPageFormData;
  onChange: (data: LandingPageFormData) => void;
  isFirst: boolean;
  isLast: boolean;
  isDuplicate?: boolean;
  duplicateId?: number;
}

export default function SectionControls({ 
  sectionId, 
  sectionTitle, 
  data, 
  onChange, 
  isFirst, 
  isLast,
  isDuplicate = false,
  duplicateId
}: SectionControlsProps) {
  
  // Section'ı yukarı taşı
  const moveUp = () => {
    const currentOrder = data.sectionOrder || [];
    const currentIndex = currentOrder.indexOf(sectionId);
    if (currentIndex > 0) {
      const newOrder = [...currentOrder];
      [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
      onChange({ ...data, sectionOrder: newOrder });
    }
  };

  // Section'ı aşağı taşı
  const moveDown = () => {
    const currentOrder = data.sectionOrder || [];
    const currentIndex = currentOrder.indexOf(sectionId);
    if (currentIndex < currentOrder.length - 1) {
      const newOrder = [...currentOrder];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
      onChange({ ...data, sectionOrder: newOrder });
    }
  };

  // Section'ı kaldır (ana section için gizle, duplicate için sil)
  const removeSection = () => {
    if (isDuplicate && duplicateId) {
      // Duplicate section'ı sil
      const duplicates = data.duplicatedSections || {};
      const currentDuplicates = duplicates[sectionId] || [];
      const filteredDuplicates = currentDuplicates.filter(
        (duplicate: any) => duplicate._duplicateId !== duplicateId
      );
      
      onChange({
        ...data,
        duplicatedSections: {
          ...duplicates,
          [sectionId]: filteredDuplicates
        }
      });
    } else {
      // Ana section'ı gizle
      const hiddenSections = data.hiddenSections || [];
      if (!hiddenSections.includes(sectionId)) {
        onChange({ 
          ...data, 
          hiddenSections: [...hiddenSections, sectionId] 
        });
      }
    }
  };

  // Section'ı duplicate et (sadece ana section için)
  const duplicateSection = () => {
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

  return (
    <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div className="flex items-center space-x-1">
        {/* Section Adı */}
        <span className="text-xs font-medium text-gray-700 mr-2">
          {sectionTitle} {isDuplicate ? '(Kopya)' : ''}
        </span>
        
        {/* Yukarı/Aşağı taşıma sadece ana section'lar için */}
        {!isDuplicate && (
          <>
            {/* Yukarı Taşı */}
            {!isFirst && (
              <button
                onClick={(e) => { e.stopPropagation(); moveUp(); }}
                className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Yukarı taşı"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            )}

            {/* Aşağı Taşı */}
            {!isLast && (
              <button
                onClick={(e) => { e.stopPropagation(); moveDown(); }}
                className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Aşağı taşı"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}

            {/* Duplicate (sadece ana section için) */}
            <button
              onClick={(e) => { e.stopPropagation(); duplicateSection(); }}
              className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Çoğalt"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </>
        )}

        {/* Kaldır */}
        <button
          onClick={(e) => { e.stopPropagation(); removeSection(); }}
          className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title={isDuplicate ? "Kopyayı sil" : "Section'ı gizle"}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
} 