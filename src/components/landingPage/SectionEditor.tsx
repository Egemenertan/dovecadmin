'use client';

import React, { useCallback } from 'react';
import { LandingPageFormData } from '@/types/landingPage';

interface SectionEditorProps {
  section: string;
  data: LandingPageFormData;
  onSectionChange: (section: string, sectionData: any) => void;
  onBasicChange: (field: string, value: any) => void;
  isLoading?: boolean;
}

// InputField component'ini dışarıya çıkarıyorum
const InputField = React.memo(({ label, value, onChange, type = 'text', placeholder, rows, disabled }: {
  label: string; 
  value: string; 
  onChange: (value: string) => void; 
  type?: string; 
  placeholder?: string; 
  rows?: number;
  disabled?: boolean;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    {type === 'textarea' ? (
      <textarea 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder} 
        rows={rows || 3}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 text-sm" 
        disabled={disabled} 
      />
    ) : (
      <input 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 text-sm" 
        disabled={disabled} 
      />
    )}
  </div>
));

InputField.displayName = 'InputField';

export default function SectionEditor({ section, data, onSectionChange, onBasicChange, isLoading }: SectionEditorProps) {
  // useCallback kullanarak handler'ları optimize ediyorum
  const handleBasicNameChange = useCallback((value: string) => {
    onBasicChange('name', value);
  }, [onBasicChange]);

  const handleBasicSlugChange = useCallback((value: string) => {
    onBasicChange('slug', value);
  }, [onBasicChange]);

  const handleBasicStatusChange = useCallback((value: string) => {
    onBasicChange('status', value);
  }, [onBasicChange]);

  // Hero section handlers
  const handleHeroTitleChange = useCallback((value: string) => {
    onSectionChange('hero', { ...data.hero, title: value });
  }, [onSectionChange, data.hero]);

  const handleHeroSubtitleChange = useCallback((value: string) => {
    onSectionChange('hero', { ...data.hero, subtitle: value });
  }, [onSectionChange, data.hero]);

  const handleHeroDescriptionChange = useCallback((value: string) => {
    onSectionChange('hero', { ...data.hero, description: value });
  }, [onSectionChange, data.hero]);

  const handleHeroPrimaryButtonTextChange = useCallback((value: string) => {
    onSectionChange('hero', { ...data.hero, primaryButtonText: value });
  }, [onSectionChange, data.hero]);

  const handleHeroPrimaryButtonLinkChange = useCallback((value: string) => {
    onSectionChange('hero', { ...data.hero, primaryButtonLink: value });
  }, [onSectionChange, data.hero]);

  const handleHeroSecondaryButtonTextChange = useCallback((value: string) => {
    onSectionChange('hero', { ...data.hero, secondaryButtonText: value });
  }, [onSectionChange, data.hero]);

  const handleHeroSecondaryButtonLinkChange = useCallback((value: string) => {
    onSectionChange('hero', { ...data.hero, secondaryButtonLink: value });
  }, [onSectionChange, data.hero]);

  if (section === 'basic') {
    return (
      <div className="p-4 space-y-4">
        <InputField 
          label="Landing Page Adı" 
          value={data.name} 
          onChange={handleBasicNameChange} 
          placeholder="Kıbrıs Emlak LP" 
          disabled={isLoading}
        />
        <InputField 
          label="Slug (URL)" 
          value={data.slug} 
          onChange={handleBasicSlugChange} 
          placeholder="cyprus-real-estate" 
          disabled={isLoading}
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
          <select 
            value={data.status} 
            onChange={(e) => handleBasicStatusChange(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
            disabled={isLoading}
          >
            <option value="draft">Taslak</option>
            <option value="published">Yayınlanmış</option>
            <option value="archived">Arşivlenmiş</option>
          </select>
        </div>
      </div>
    );
  }

  if (section === 'hero') {
    return (
      <div className="p-4 space-y-4">
        <InputField 
          label="Ana Başlık" 
          value={data.hero.title} 
          onChange={handleHeroTitleChange} 
          disabled={isLoading}
        />
        <InputField 
          label="Alt Başlık" 
          value={data.hero.subtitle} 
          onChange={handleHeroSubtitleChange} 
          disabled={isLoading}
        />
        <InputField 
          label="Açıklama" 
          type="textarea" 
          value={data.hero.description} 
          onChange={handleHeroDescriptionChange} 
          rows={4} 
          disabled={isLoading}
        />
        <InputField 
          label="Birincil Buton Metni" 
          value={data.hero.primaryButtonText} 
          onChange={handleHeroPrimaryButtonTextChange} 
          disabled={isLoading}
        />
        <InputField 
          label="Birincil Buton Link" 
          value={data.hero.primaryButtonLink} 
          onChange={handleHeroPrimaryButtonLinkChange} 
          disabled={isLoading}
        />
        <InputField 
          label="İkincil Buton Metni" 
          value={data.hero.secondaryButtonText} 
          onChange={handleHeroSecondaryButtonTextChange} 
          disabled={isLoading}
        />
        <InputField 
          label="İkincil Buton Link" 
          value={data.hero.secondaryButtonLink} 
          onChange={handleHeroSecondaryButtonLinkChange} 
          disabled={isLoading}
        />
      </div>
    );
  }

  if (section === 'premium') {
    return (
      <div className="p-4 space-y-4">
        <InputField 
          label="Başlık" 
          value={data.premium.title} 
          onChange={(v) => onSectionChange('premium', { ...data.premium, title: v })} 
          disabled={isLoading}
        />
        <InputField 
          label="Açıklama" 
          type="textarea" 
          value={data.premium.description} 
          onChange={(v) => onSectionChange('premium', { ...data.premium, description: v })} 
          rows={4} 
          disabled={isLoading}
        />
        <InputField 
          label="Arkaplan Resmi URL" 
          value={data.premium.backgroundImage || ''} 
          onChange={(v) => onSectionChange('premium', { ...data.premium, backgroundImage: v })} 
          placeholder="/images/premium-bg.jpg"
          disabled={isLoading}
        />
        
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Özellikler</h4>
          {data.premium.features.map((feature, i) => (
            <div key={`premium-feature-${i}`} className="border p-3 rounded space-y-2">
              <h5 className="font-medium text-xs">Özellik {i + 1}</h5>
              <InputField 
                label="Özellik Başlığı" 
                value={feature.title} 
                onChange={(v) => {
                  const newFeatures = [...data.premium.features];
                  newFeatures[i] = { ...feature, title: v };
                  onSectionChange('premium', { ...data.premium, features: newFeatures });
                }} 
                disabled={isLoading}
              />
              <InputField 
                label="Özellik Açıklaması" 
                type="textarea" 
                value={feature.description} 
                onChange={(v) => {
                  const newFeatures = [...data.premium.features];
                  newFeatures[i] = { ...feature, description: v };
                  onSectionChange('premium', { ...data.premium, features: newFeatures });
                }} 
                rows={2} 
                disabled={isLoading}
              />
            </div>
          ))}
          <button 
            onClick={() => {
              const newFeatures = [...data.premium.features, { title: '', description: '' }];
              onSectionChange('premium', { ...data.premium, features: newFeatures });
            }} 
            className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600" 
            disabled={isLoading}
          >
            + Özellik Ekle
          </button>
        </div>
      </div>
    );
  }

  if (section === 'stats') {
    return (
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Arkaplan Rengi</label>
          <input 
            type="color" 
            value={data.stats.backgroundColor} 
            onChange={(e) => onSectionChange('stats', { ...data.stats, backgroundColor: e.target.value })} 
            className="w-full h-10 border border-gray-300 rounded-md"
            disabled={isLoading}
          />
        </div>
        {data.stats.stats.map((stat, i) => (
          <div key={`stat-${i}`} className="border p-3 rounded space-y-2">
            <h4 className="font-medium text-sm">İstatistik {i + 1}</h4>
            <InputField 
              label="Değer" 
              value={stat.value} 
              onChange={(v) => {
                const newStats = [...data.stats.stats]; 
                newStats[i] = { ...stat, value: v };
                onSectionChange('stats', { ...data.stats, stats: newStats });
              }} 
              disabled={isLoading}
            />
            <InputField 
              label="Etiket" 
              value={stat.label} 
              onChange={(v) => {
                const newStats = [...data.stats.stats]; 
                newStats[i] = { ...stat, label: v };
                onSectionChange('stats', { ...data.stats, stats: newStats });
              }} 
              disabled={isLoading}
            />
          </div>
        ))}
      </div>
    );
  }

  if (section === 'comparison') {
    return (
      <div className="p-4 space-y-4">
        <InputField 
          label="Başlık" 
          value={data.comparison.title} 
          onChange={(v) => onSectionChange('comparison', { ...data.comparison, title: v })} 
          disabled={isLoading}
        />
        <InputField 
          label="Alt Not" 
          value={data.comparison.footerNote} 
          onChange={(v) => onSectionChange('comparison', { ...data.comparison, footerNote: v })} 
          disabled={isLoading}
        />
        
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Tablo Başlıkları</h4>
          <div className="border p-3 rounded space-y-2">
            <InputField 
              label="İlk Sütun Başlığı" 
              value={data.comparison.tableHeaders.criterion} 
              onChange={(v) => onSectionChange('comparison', { ...data.comparison, tableHeaders: { ...data.comparison.tableHeaders, criterion: v } })} 
              disabled={isLoading}
            />
            <InputField 
              label="İkinci Sütun Başlığı" 
              value={data.comparison.tableHeaders.istanbul} 
              onChange={(v) => onSectionChange('comparison', { ...data.comparison, tableHeaders: { ...data.comparison.tableHeaders, istanbul: v } })} 
              disabled={isLoading}
            />
            <InputField 
              label="Üçüncü Sütun Başlığı" 
              value={data.comparison.tableHeaders.cyprus} 
              onChange={(v) => onSectionChange('comparison', { ...data.comparison, tableHeaders: { ...data.comparison.tableHeaders, cyprus: v } })} 
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Tablo Satırları</h4>
          {data.comparison.tableRows.map((row, i) => (
            <div key={`row-${i}`} className="border p-3 rounded space-y-2">
              <h5 className="font-medium text-xs">Satır {i + 1}</h5>
              <InputField 
                label="Kriter" 
                value={row.criterion} 
                onChange={(v) => {
                  const newRows = [...data.comparison.tableRows];
                  newRows[i] = { ...row, criterion: v };
                  onSectionChange('comparison', { ...data.comparison, tableRows: newRows });
                }} 
                disabled={isLoading}
              />
              <InputField 
                label="İstanbul" 
                value={row.istanbul} 
                onChange={(v) => {
                  const newRows = [...data.comparison.tableRows];
                  newRows[i] = { ...row, istanbul: v };
                  onSectionChange('comparison', { ...data.comparison, tableRows: newRows });
                }} 
                disabled={isLoading}
              />
              <InputField 
                label="Kıbrıs" 
                value={row.cyprus} 
                onChange={(v) => {
                  const newRows = [...data.comparison.tableRows];
                  newRows[i] = { ...row, cyprus: v };
                  onSectionChange('comparison', { ...data.comparison, tableRows: newRows });
                }} 
                disabled={isLoading}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section === 'company') {
    return (
      <div className="p-4 space-y-4">
        <InputField 
          label="Başlık" 
          value={data.company.title} 
          onChange={(v) => onSectionChange('company', { ...data.company, title: v })} 
          disabled={isLoading}
        />
        <InputField 
          label="Açıklama" 
          type="textarea" 
          value={data.company.description} 
          onChange={(v) => onSectionChange('company', { ...data.company, description: v })} 
          rows={3} 
          disabled={isLoading}
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Özellikler</label>
          {data.company.features.map((feature, i) => (
            <input 
              key={`feature-${i}`} 
              type="text" 
              value={feature} 
              onChange={(e) => {
                const newFeatures = [...data.company.features];
                newFeatures[i] = e.target.value;
                onSectionChange('company', { ...data.company, features: newFeatures });
              }} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-yellow-500" 
              disabled={isLoading} 
            />
          ))}
          <button 
            onClick={() => {
              const newFeatures = [...data.company.features, ''];
              onSectionChange('company', { ...data.company, features: newFeatures });
            }} 
            className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600" 
            disabled={isLoading}
          >
            + Özellik Ekle
          </button>
        </div>
      </div>
    );
  }

  if (section === 'faq') {
    return (
      <div className="p-4 space-y-4">
        <InputField 
          label="Başlık" 
          value={data.faq.title} 
          onChange={(v) => onSectionChange('faq', { ...data.faq, title: v })} 
          disabled={isLoading}
        />
        
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Sorular & Cevaplar</h4>
          {data.faq.faqs.map((faq, i) => (
            <div key={`faq-${i}`} className="border p-3 rounded space-y-2">
              <h5 className="font-medium text-xs">S&C {i + 1}</h5>
              <InputField 
                label="Soru" 
                value={faq.question} 
                onChange={(v) => {
                  const newFaqs = [...data.faq.faqs];
                  newFaqs[i] = { ...faq, question: v };
                  onSectionChange('faq', { ...data.faq, faqs: newFaqs });
                }} 
                disabled={isLoading}
              />
              <InputField 
                label="Cevap" 
                type="textarea" 
                value={faq.answer} 
                onChange={(v) => {
                  const newFaqs = [...data.faq.faqs];
                  newFaqs[i] = { ...faq, answer: v };
                  onSectionChange('faq', { ...data.faq, faqs: newFaqs });
                }} 
                rows={2} 
                disabled={isLoading}
              />
            </div>
          ))}
          <button 
            onClick={() => {
              const newFaqs = [...data.faq.faqs, { question: '', answer: '' }];
              onSectionChange('faq', { ...data.faq, faqs: newFaqs });
            }} 
            className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600" 
            disabled={isLoading}
          >
            + Soru Ekle
          </button>
        </div>
      </div>
    );
  }

  if (section === 'cta') {
    return (
      <div className="p-4 space-y-4">
        <InputField 
          label="Başlık" 
          value={data.cta.title} 
          onChange={(v) => onSectionChange('cta', { ...data.cta, title: v })} 
          disabled={isLoading}
        />
        <InputField 
          label="Açıklama" 
          type="textarea" 
          value={data.cta.description} 
          onChange={(v) => onSectionChange('cta', { ...data.cta, description: v })} 
          rows={3} 
          disabled={isLoading}
        />
        <InputField 
          label="Birincil Buton Metni" 
          value={data.cta.primaryButtonText} 
          onChange={(v) => onSectionChange('cta', { ...data.cta, primaryButtonText: v })} 
          disabled={isLoading}
        />
        <InputField 
          label="Birincil Buton Link" 
          value={data.cta.primaryButtonLink} 
          onChange={(v) => onSectionChange('cta', { ...data.cta, primaryButtonLink: v })} 
          disabled={isLoading}
        />
        <InputField 
          label="İkincil Buton Metni" 
          value={data.cta.secondaryButtonText} 
          onChange={(v) => onSectionChange('cta', { ...data.cta, secondaryButtonText: v })} 
          disabled={isLoading}
        />
        <InputField 
          label="İkincil Buton Link" 
          value={data.cta.secondaryButtonLink} 
          onChange={(v) => onSectionChange('cta', { ...data.cta, secondaryButtonLink: v })} 
          disabled={isLoading}
        />
        <InputField 
          label="Alt Metin" 
          value={data.cta.footerText} 
          onChange={(v) => onSectionChange('cta', { ...data.cta, footerText: v })} 
          disabled={isLoading}
        />
      </div>
    );
  }

  if (section === 'familyFeatures') {
    return (
      <div className="p-4 space-y-4">
        <InputField 
          label="Ana Başlık" 
          value={data.familyFeatures.title} 
          onChange={(v) => onSectionChange('familyFeatures', { ...data.familyFeatures, title: v })} 
          disabled={isLoading}
        />
        <InputField 
          label="Alt Başlık" 
          value={data.familyFeatures.subtitle} 
          onChange={(v) => onSectionChange('familyFeatures', { ...data.familyFeatures, subtitle: v })} 
          disabled={isLoading}
        />
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Özellikler</label>
          {data.familyFeatures.features.map((feature, index) => (
            <div key={index} className="border border-gray-200 rounded p-3 space-y-2">
              <InputField 
                label={`Özellik ${index + 1} Başlığı`} 
                value={feature.title} 
                onChange={(v) => {
                  const updatedFeatures = [...data.familyFeatures.features];
                  updatedFeatures[index] = { ...feature, title: v };
                  onSectionChange('familyFeatures', { ...data.familyFeatures, features: updatedFeatures });
                }} 
                disabled={isLoading}
              />
              <InputField 
                label={`Özellik ${index + 1} Açıklaması`} 
                value={feature.description} 
                onChange={(v) => {
                  const updatedFeatures = [...data.familyFeatures.features];
                  updatedFeatures[index] = { ...feature, description: v };
                  onSectionChange('familyFeatures', { ...data.familyFeatures, features: updatedFeatures });
                }} 
                disabled={isLoading}
              />
            </div>
          ))}
        </div>
        <InputField 
          label="Alt Metin / Alıntı" 
          type="textarea" 
          value={data.familyFeatures.bottomQuote} 
          onChange={(v) => onSectionChange('familyFeatures', { ...data.familyFeatures, bottomQuote: v })} 
          rows={3} 
          disabled={isLoading}
        />
      </div>
    );
  }

  if (section === 'education') {
    return (
      <div className="p-4 space-y-4">
        <InputField 
          label="Ana Başlık" 
          value={data.education.title} 
          onChange={(v) => onSectionChange('education', { ...data.education, title: v })} 
          disabled={isLoading}
        />
        <InputField 
          label="Alt Başlık" 
          value={data.education.subtitle} 
          onChange={(v) => onSectionChange('education', { ...data.education, subtitle: v })} 
          disabled={isLoading}
        />
        <InputField 
          label="Açıklama" 
          type="textarea" 
          value={data.education.description} 
          onChange={(v) => onSectionChange('education', { ...data.education, description: v })} 
          rows={4} 
          disabled={isLoading}
        />
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Avantajlar</label>
          {data.education.benefits.map((benefit, index) => (
            <InputField 
              key={index}
              label={`Avantaj ${index + 1}`} 
              value={benefit} 
              onChange={(v) => {
                const updatedBenefits = [...data.education.benefits];
                updatedBenefits[index] = v;
                onSectionChange('education', { ...data.education, benefits: updatedBenefits });
              }} 
              disabled={isLoading}
            />
          ))}
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Eğitim Avantajları</label>
          {data.education.advantages.map((advantage, index) => (
            <div key={index} className="border border-gray-200 rounded p-3 space-y-2">
              <InputField 
                label="Başlık" 
                value={advantage.title} 
                onChange={(v) => {
                  const updatedAdvantages = [...data.education.advantages];
                  updatedAdvantages[index] = { ...advantage, title: v };
                  onSectionChange('education', { ...data.education, advantages: updatedAdvantages });
                }} 
                disabled={isLoading}
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Maddeler</label>
                {advantage.items.map((item, itemIndex) => (
                  <InputField 
                    key={itemIndex}
                    label={`Madde ${itemIndex + 1}`} 
                    value={item} 
                    onChange={(v) => {
                      const updatedAdvantages = [...data.education.advantages];
                      const updatedItems = [...advantage.items];
                      updatedItems[itemIndex] = v;
                      updatedAdvantages[index] = { ...advantage, items: updatedItems };
                      onSectionChange('education', { ...data.education, advantages: updatedAdvantages });
                    }} 
                    disabled={isLoading}
                  />
                ))}
              </div>
              <InputField 
                label="Alıntı" 
                type="textarea" 
                value={advantage.quote} 
                onChange={(v) => {
                  const updatedAdvantages = [...data.education.advantages];
                  updatedAdvantages[index] = { ...advantage, quote: v };
                  onSectionChange('education', { ...data.education, advantages: updatedAdvantages });
                }} 
                rows={2} 
                disabled={isLoading}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section === 'paymentSystem') {
    return (
      <div className="p-4 space-y-4">
        <InputField 
          label="Ana Başlık" 
          value={data.paymentSystem.title} 
          onChange={(v) => onSectionChange('paymentSystem', { ...data.paymentSystem, title: v })} 
          disabled={isLoading}
        />
        <InputField 
          label="Alt Başlık" 
          value={data.paymentSystem.subtitle} 
          onChange={(v) => onSectionChange('paymentSystem', { ...data.paymentSystem, subtitle: v })} 
          disabled={isLoading}
        />
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Ödeme Seçenekleri</label>
          {data.paymentSystem.paymentOptions.map((option, index) => (
            <div key={index} className="border border-gray-200 rounded p-3 space-y-2">
              <InputField 
                label={`Seçenek ${index + 1} Başlığı`} 
                value={option.title} 
                onChange={(v) => {
                  const updatedOptions = [...data.paymentSystem.paymentOptions];
                  updatedOptions[index] = { ...option, title: v };
                  onSectionChange('paymentSystem', { ...data.paymentSystem, paymentOptions: updatedOptions });
                }} 
                disabled={isLoading}
              />
              <InputField 
                label={`Seçenek ${index + 1} Açıklaması`} 
                value={option.description} 
                onChange={(v) => {
                  const updatedOptions = [...data.paymentSystem.paymentOptions];
                  updatedOptions[index] = { ...option, description: v };
                  onSectionChange('paymentSystem', { ...data.paymentSystem, paymentOptions: updatedOptions });
                }} 
                disabled={isLoading}
              />
              <InputField 
                label={`Seçenek ${index + 1} Border Rengi`} 
                value={option.borderColor} 
                onChange={(v) => {
                  const updatedOptions = [...data.paymentSystem.paymentOptions];
                  updatedOptions[index] = { ...option, borderColor: v };
                  onSectionChange('paymentSystem', { ...data.paymentSystem, paymentOptions: updatedOptions });
                }} 
                disabled={isLoading}
              />
            </div>
          ))}
        </div>
        <InputField 
          label="Alt Metin / Alıntı" 
          type="textarea" 
          value={data.paymentSystem.bottomQuote} 
          onChange={(v) => onSectionChange('paymentSystem', { ...data.paymentSystem, bottomQuote: v })} 
          rows={3} 
          disabled={isLoading}
        />
      </div>
    );
  }

  if (section === 'customerStory') {
    return (
      <div className="p-4 space-y-4">
        <InputField 
          label="Ana Başlık" 
          value={data.customerStory.title} 
          onChange={(v) => onSectionChange('customerStory', { ...data.customerStory, title: v })} 
          disabled={isLoading}
        />
        <InputField 
          label="Alt Başlık" 
          value={data.customerStory.subtitle} 
          onChange={(v) => onSectionChange('customerStory', { ...data.customerStory, subtitle: v })} 
          disabled={isLoading}
        />
        <InputField 
          label="Müşteri Alıntısı" 
          type="textarea" 
          value={data.customerStory.quote} 
          onChange={(v) => onSectionChange('customerStory', { ...data.customerStory, quote: v })} 
          rows={5} 
          disabled={isLoading}
        />
        <InputField 
          label="Müşteri İsmi / Kimliği" 
          value={data.customerStory.author} 
          onChange={(v) => onSectionChange('customerStory', { ...data.customerStory, author: v })} 
          disabled={isLoading}
        />
        <InputField 
          label="Arkaplan Resmi URL" 
          value={data.customerStory.backgroundImage} 
          onChange={(v) => onSectionChange('customerStory', { ...data.customerStory, backgroundImage: v })} 
          disabled={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="text-center text-gray-500 py-8">
        <div className="text-4xl mb-4">🎨</div>
        <p className="font-medium">Bölüm editörü hazır!</p>
        <p className="text-sm mt-2">Tüm bölümler artık düzenlenebilir durumda.</p>
      </div>
    </div>
  );
}
