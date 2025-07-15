'use client';

import React, { useState, useEffect } from 'react';
import { LandingPageFormData } from '@/types/landingPage';
import LandingPagePreview from './LandingPagePreview';
import SectionManagementPanel from './SectionManagementPanel';

interface LandingPageEditorProps {
  data: LandingPageFormData;
  onChange: (data: LandingPageFormData) => void;
  isLoading?: boolean;
}

export default function LandingPageEditor({ data, onChange, isLoading }: LandingPageEditorProps) {
  const [activeSection, setActiveSection] = useState<string>('basic');
  const [baseUrl, setBaseUrl] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="w-full bg-white relative">
      {/* Top Info Bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <span className="text-lg font-medium text-gray-900">
              {data.name || 'Başlıksız Landing Page'} - Canlı Düzenleme
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Section Management Toggle */}
            <button
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isPanelOpen 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔧 Section Yönetimi
            </button>
            
            <div className="text-sm text-gray-500 bg-yellow-100 px-3 py-1 rounded-full">
              {activeSection ? `Aktif: ${activeSection}` : 'Düzenleme Modu'}
            </div>
            {isLoading && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Kaydediliyor...</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Slug Input Row */}
        <div className="mt-3 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">URL:</span>
            <span className="text-sm text-gray-500">/{' '}</span>
            <input
              type="text"
              value={data.slug}
              onChange={(e) => onChange({ ...data, slug: e.target.value })}
              className="text-sm px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none min-w-[200px]"
              placeholder="landing-page-url"
              disabled={isLoading}
            />
          </div>
          
          {/* Preview URL */}
          {baseUrl && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>→</span>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                {baseUrl}/lp/{data.slug || 'landing-page-url'}
              </code>
            </div>
          )}
        </div>
        
        {/* Help Text */}
        <div className="mt-3 text-sm text-gray-600">
          💡 Herhangi bir metne tıklayarak düzenleyebilirsiniz. <kbd className="bg-gray-200 px-1 rounded">Enter</kbd> kaydet, <kbd className="bg-gray-200 px-1 rounded">ESC</kbd> iptal.
        </div>
      </div>

      {/* Full Width Preview */}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-full mx-auto">
          <LandingPagePreview 
            data={data} 
            activeSection={activeSection} 
            onSectionClick={handleSectionClick} 
            onChange={onChange}
          />
        </div>
      </div>

      {/* Section Management Panel */}
      <SectionManagementPanel
        data={data}
        onChange={onChange}
        isOpen={isPanelOpen}
        onToggle={() => setIsPanelOpen(!isPanelOpen)}
      />
    </div>
  );
} 