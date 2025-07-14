'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LandingPageFormData } from '@/types/landingPage';

interface LandingPagePreviewProps {
  data: LandingPageFormData;
  activeSection: string | null;
  onSectionClick: (section: string) => void;
  onChange?: (data: LandingPageFormData) => void;
}

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'blockquote' | 'cite';
}

function EditableText({ value, onChange, className = '', multiline = false, placeholder, tag = 'p' }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Enter' && multiline && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    return multiline ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`bg-white/95 border-2 border-yellow-400 rounded px-2 py-1 outline-none resize-none text-gray-900 font-normal`}
        style={{ fontSize: 'inherit', lineHeight: 'inherit' }}
        rows={3}
        placeholder={placeholder}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`bg-white/95 border-2 border-yellow-400 rounded px-2 py-1 outline-none text-gray-900 font-normal`}
        style={{ fontSize: 'inherit', lineHeight: 'inherit' }}
        placeholder={placeholder}
      />
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const Tag = tag;
  return (
    <Tag
      onClick={handleClick}
      className={`${className} cursor-text hover:bg-yellow-100/20 hover:ring-2 hover:ring-yellow-400/50 rounded transition-all duration-200 relative group`}
      title="Düzenlemek için tıklayın"
    >
      {value || placeholder}
      <span className="absolute -top-6 left-0 bg-yellow-400 text-yellow-900 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        ✏️ Düzenle
      </span>
    </Tag>
  );
}

export default function LandingPagePreview({ data, activeSection, onSectionClick, onChange }: LandingPagePreviewProps) {
  const getSectionClass = (sectionId: string) => {
    return `cursor-pointer transition-all duration-300 ${
      activeSection === sectionId 
        ? 'ring-4 ring-yellow-400 ring-opacity-50 relative' 
        : 'hover:ring-2 hover:ring-gray-300 hover:ring-opacity-50'
    }`;
  };

  const SectionIndicator = ({ sectionId, title }: { sectionId: string; title: string }) => (
    activeSection === sectionId && (
      <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-medium z-10">
        ✏️ {title}
      </div>
    )
  );

  // Helper function to update data if onChange is available
  const updateData = (newData: LandingPageFormData) => {
    if (onChange) {
      onChange(newData);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div 
        className={getSectionClass('hero')}
        onClick={() => onSectionClick('hero')}
      >
        <SectionIndicator sectionId="hero" title="Hero Section" />
        <div 
          className="relative h-96 w-full overflow-hidden bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600"
          style={{
            backgroundImage: data.hero.backgroundImage ? `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url(${data.hero.backgroundImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center text-white">
              <EditableText
                value={data.hero.title}
                onChange={(value) => updateData({ ...data, hero: { ...data.hero, title: value } })}
                className="text-3xl md:text-5xl font-light mb-4 leading-tight block"
                tag="h1"
                placeholder="Ana başlık"
              />
              <EditableText
                value={data.hero.subtitle}
                onChange={(value) => updateData({ ...data, hero: { ...data.hero, subtitle: value } })}
                className="text-yellow-400 font-medium text-3xl md:text-5xl"
                tag="span"
                placeholder="Alt başlık"
              />
              <EditableText
                value={data.hero.description}
                onChange={(value) => updateData({ ...data, hero: { ...data.hero, description: value } })}
                className="text-base md:text-xl font-light max-w-3xl mx-auto leading-relaxed text-white/95 mb-8 block mt-4"
                tag="p"
                multiline
                placeholder="Açıklama"
              />
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href={data.hero.primaryButtonLink}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-none transition-all duration-500 text-lg"
                >
                  <EditableText
                    value={data.hero.primaryButtonText}
                    onChange={(value) => updateData({ ...data, hero: { ...data.hero, primaryButtonText: value } })}
                    className="text-black"
                    placeholder="Buton metni"
                  />
                </a>
                <a 
                  href={data.hero.secondaryButtonLink}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-semibold rounded-none transition-all duration-500 text-lg"
                >
                  <EditableText
                    value={data.hero.secondaryButtonText}
                    onChange={(value) => updateData({ ...data, hero: { ...data.hero, secondaryButtonText: value } })}
                    className="text-inherit"
                    placeholder="İkinci buton metni"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div 
        className={getSectionClass('stats')}
        onClick={() => onSectionClick('stats')}
      >
        <SectionIndicator sectionId="stats" title="İstatistikler" />
        <div className="py-20" style={{ 
          backgroundColor: data.stats.backgroundColor,
          color: data.stats.textColor 
        }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {data.stats.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <EditableText
                    value={stat.value}
                    onChange={(value) => updateData({ ...data, stats: { ...data.stats, stats: data.stats.stats.map((s, i) => i === index ? { ...s, value: value } : s) } })}
                    className="text-4xl lg:text-5xl font-light mb-2 block"
                    placeholder="Değer"
                  />
                  <EditableText
                    value={stat.label}
                    onChange={(value) => updateData({ ...data, stats: { ...data.stats, stats: data.stats.stats.map((s, i) => i === index ? { ...s, label: value } : s) } })}
                    className="block"
                    placeholder="Etiket"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Premium Section */}
      <div 
        className={getSectionClass('premium')}
        onClick={() => onSectionClick('premium')}
      >
        <SectionIndicator sectionId="premium" title="Premium İçerik" />
        <div className="relative py-32 overflow-hidden bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900">
          <div 
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage: data.premium.backgroundImage ? `url(${data.premium.backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <div className="text-white bg-black/40 backdrop-blur-sm p-8 lg:p-12 rounded-none border border-white/10">
              <EditableText
                value={data.premium.title}
                onChange={(value) => updateData({ ...data, premium: { ...data.premium, title: value } })}
                className="text-4xl lg:text-5xl font-light mb-8 leading-tight"
                tag="h2"
                placeholder="Premium Başlık"
              />
              <EditableText
                value={data.premium.description}
                onChange={(value) => updateData({ ...data, premium: { ...data.premium, description: value } })}
                className="text-xl mb-8 leading-relaxed"
                tag="p"
                multiline
                placeholder="Premium Açıklama"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.premium.features.map((feature, index) => (
                  <div key={index} className="bg-yellow-400/20 backdrop-blur-sm p-6 rounded-none border border-yellow-400/30">
                    <EditableText
                      value={feature.title}
                      onChange={(value) => updateData({ ...data, premium: { ...data.premium, features: data.premium.features.map((f, i) => i === index ? { ...f, title: value } : f) } })}
                      className="text-yellow-400 font-semibold mb-2 text-lg"
                      tag="h3"
                      placeholder="Özellik Başlığı"
                    />
                    <EditableText
                      value={feature.description}
                      onChange={(value) => updateData({ ...data, premium: { ...data.premium, features: data.premium.features.map((f, i) => i === index ? { ...f, description: value } : f) } })}
                      className="text-sm text-white/90"
                      tag="p"
                      multiline
                      placeholder="Özellik Açıklaması"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div 
        className={getSectionClass('comparison')}
        onClick={() => onSectionClick('comparison')}
      >
        <SectionIndicator sectionId="comparison" title="Karşılaştırma" />
        <div className="bg-gradient-to-b from-gray-50 to-white py-32">
          <div className="max-w-6xl mx-auto px-4">
            <EditableText
              value={data.comparison.title}
              onChange={(value) => updateData({ ...data, comparison: { ...data.comparison, title: value } })}
              className="text-4xl lg:text-5xl font-light text-center text-gray-900 mb-16"
              tag="h2"
              placeholder="Karşılaştırma Başlığı"
            />
            <div className="bg-white rounded-none shadow-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="px-6 py-6 text-left text-lg font-light">
                      <EditableText
                        value={data.comparison.tableHeaders.criterion}
                        onChange={(value) => updateData({ ...data, comparison: { ...data.comparison, tableHeaders: { ...data.comparison.tableHeaders, criterion: value } } })}
                        className="text-lg font-light text-white"
                        tag="span"
                        placeholder="Kriter"
                      />
                    </th>
                    <th className="px-6 py-6 text-center text-lg font-light">
                      <EditableText
                        value={data.comparison.tableHeaders.istanbul}
                        onChange={(value) => updateData({ ...data, comparison: { ...data.comparison, tableHeaders: { ...data.comparison.tableHeaders, istanbul: value } } })}
                        className="text-lg font-light text-white"
                        tag="span"
                        placeholder="İstanbul"
                      />
                    </th>
                    <th className="px-6 py-6 text-center text-lg font-light bg-yellow-400 text-gray-900">
                      <EditableText
                        value={data.comparison.tableHeaders.cyprus}
                        onChange={(value) => updateData({ ...data, comparison: { ...data.comparison, tableHeaders: { ...data.comparison.tableHeaders, cyprus: value } } })}
                        className="text-lg font-light text-gray-900"
                        tag="span"
                        placeholder="Kıbrıs"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.comparison.tableRows.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-6 font-medium">
                        <EditableText
                          value={row.criterion}
                          onChange={(value) => updateData({ ...data, comparison: { ...data.comparison, tableRows: data.comparison.tableRows.map((r, i) => i === index ? { ...r, criterion: value } : r) } })}
                          className="text-lg font-medium"
                          tag="span"
                          placeholder="Kriter"
                        />
                      </td>
                      <td className="px-6 py-6 text-center">
                        <EditableText
                          value={row.istanbul}
                          onChange={(value) => updateData({ ...data, comparison: { ...data.comparison, tableRows: data.comparison.tableRows.map((r, i) => i === index ? { ...r, istanbul: value } : r) } })}
                          className="text-lg"
                          tag="span"
                          placeholder="İstanbul Değeri"
                        />
                      </td>
                      <td className="px-6 py-6 text-center text-green-600 font-bold">
                        <EditableText
                          value={row.cyprus}
                          onChange={(value) => updateData({ ...data, comparison: { ...data.comparison, tableRows: data.comparison.tableRows.map((r, i) => i === index ? { ...r, cyprus: value } : r) } })}
                          className="text-lg font-bold"
                          tag="span"
                          placeholder="Kıbrıs Değeri"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.comparison.footerNote && (
              <EditableText
                value={data.comparison.footerNote}
                onChange={(value) => updateData({ ...data, comparison: { ...data.comparison, footerNote: value } })}
                className="mt-8 text-center text-gray-600 italic"
                tag="p"
                multiline
                placeholder="Karşılaştırma Alt Notu"
              />
            )}
          </div>
        </div>
      </div>

      {/* Company Section */}
      <div 
        className={getSectionClass('company')}
        onClick={() => onSectionClick('company')}
      >
        <SectionIndicator sectionId="company" title="Şirket Bilgisi" />
        <div className="relative py-32 overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black">
          <div 
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage: data.company.backgroundImage ? `url(${data.company.backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <EditableText
              value={data.company.title}
              onChange={(value) => updateData({ ...data, company: { ...data.company, title: value } })}
              className="text-4xl lg:text-5xl font-light mb-8 leading-tight"
              tag="h2"
              placeholder="Şirket Başlığı"
            />
            <EditableText
              value={data.company.description}
              onChange={(value) => updateData({ ...data, company: { ...data.company, description: value } })}
              className="text-xl mb-8 opacity-90"
              tag="p"
              multiline
              placeholder="Şirket Açıklaması"
            />
            
            <div className="grid grid-cols-1 gap-4">
              {data.company.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4 bg-yellow-400/10 backdrop-blur-sm p-4 rounded-none border-l-4 border-yellow-400">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0" />
                  <EditableText
                    value={feature}
                    onChange={(value) => updateData({ ...data, company: { ...data.company, features: data.company.features.map((f, i) => i === index ? value : f) } })}
                    className="text-lg"
                    tag="span"
                    placeholder="Özellik"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div 
        className={getSectionClass('faq')}
        onClick={() => onSectionClick('faq')}
      >
        <SectionIndicator sectionId="faq" title="Sık Sorulan Sorular" />
        <div className="bg-white py-32">
          <div className="max-w-4xl mx-auto px-4">
            <EditableText
              value={data.faq.title}
              onChange={(value) => updateData({ ...data, faq: { ...data.faq, title: value } })}
              className="text-4xl lg:text-5xl font-light text-center text-[#061E4F] mb-16 leading-tight"
              tag="h2"
              placeholder="Sık Sorulan Sorular Başlığı"
            />
            <div className="space-y-6">
              {data.faq.faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-none border-l-4 border-yellow-400">
                  <EditableText
                    value={faq.question}
                    onChange={(value) => updateData({ ...data, faq: { ...data.faq, faqs: data.faq.faqs.map((f, i) => i === index ? { ...f, question: value } : f) } })}
                    className="text-xl font-semibold text-[#061E4F] mb-4"
                    tag="h3"
                    placeholder="Soru"
                  />
                  <EditableText
                    value={faq.answer}
                    onChange={(value) => updateData({ ...data, faq: { ...data.faq, faqs: data.faq.faqs.map((f, i) => i === index ? { ...f, answer: value } : f) } })}
                    className="text-lg text-gray-700 leading-relaxed"
                    tag="p"
                    multiline
                    placeholder="Cevap"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Family Features Section */}
      <div 
        className={getSectionClass('familyFeatures')}
        onClick={() => onSectionClick('familyFeatures')}
      >
        <SectionIndicator sectionId="familyFeatures" title="Aile Özellikleri" />
        <div className="bg-gradient-to-b from-gray-50 to-white py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <EditableText
              value={data.familyFeatures.title}
              onChange={(value) => updateData({ ...data, familyFeatures: { ...data.familyFeatures, title: value } })}
              className="text-4xl lg:text-5xl font-light text-center text-[#061E4F] mb-16"
              tag="h2"
              placeholder="Aile Özellikleri Başlığı"
            />
            <EditableText
              value={data.familyFeatures.subtitle}
              onChange={(value) => updateData({ ...data, familyFeatures: { ...data.familyFeatures, subtitle: value } })}
              className="text-yellow-500"
              tag="span"
              placeholder="Aile Özellikleri Alt Başlığı"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {data.familyFeatures.features.map((feature, index) => (
                <div key={index} className="bg-white p-8 rounded-none shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-yellow-400">
                  <EditableText
                    value={feature.title}
                    onChange={(value) => updateData({ ...data, familyFeatures: { ...data.familyFeatures, features: data.familyFeatures.features.map((f, i) => i === index ? { ...f, title: value } : f) } })}
                    className="text-xl font-semibold text-[#061E4F] mb-2"
                    tag="h3"
                    placeholder="Özellik Başlığı"
                  />
                  <EditableText
                    value={feature.description}
                    onChange={(value) => updateData({ ...data, familyFeatures: { ...data.familyFeatures, features: data.familyFeatures.features.map((f, i) => i === index ? { ...f, description: value } : f) } })}
                    className="text-gray-700"
                    tag="p"
                    multiline
                    placeholder="Özellik Açıklaması"
                  />
                </div>
              ))}
            </div>

            <div className="bg-white rounded-none shadow-2xl p-8 border border-yellow-400/30">
              <EditableText
                value={data.familyFeatures.bottomQuote}
                onChange={(value) => updateData({ ...data, familyFeatures: { ...data.familyFeatures, bottomQuote: value } })}
                className="text-lg text-center text-gray-700 italic"
                tag="p"
                multiline
                placeholder="Aile Özellikleri Alt Notu"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div 
        className={getSectionClass('education')}
        onClick={() => onSectionClick('education')}
      >
        <SectionIndicator sectionId="education" title="Eğitim" />
        <div className="bg-[#061E4F] text-white py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <EditableText
              value={data.education.title}
              onChange={(value) => updateData({ ...data, education: { ...data.education, title: value } })}
              className="text-4xl lg:text-5xl font-light text-center mb-16"
              tag="h2"
              placeholder="Eğitim Başlığı"
            />
            <EditableText
              value={data.education.subtitle}
              onChange={(value) => updateData({ ...data, education: { ...data.education, subtitle: value } })}
              className="text-yellow-400"
              tag="span"
              placeholder="Eğitim Alt Başlığı"
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <EditableText
                  value={data.education.description}
                  onChange={(value) => updateData({ ...data, education: { ...data.education, description: value } })}
                  className="text-xl mb-8 leading-relaxed"
                  tag="p"
                  multiline
                  placeholder="Eğitim Açıklaması"
                />
                
                <div className="space-y-4">
                  {data.education.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0" />
                      <EditableText
                        value={benefit}
                        onChange={(value) => updateData({ ...data, education: { ...data.education, benefits: data.education.benefits.map((b, i) => i === index ? value : b) } })}
                        className="text-lg"
                        tag="span"
                        placeholder="Fayda"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-yellow-400/10 backdrop-blur-sm p-8 rounded-none border border-yellow-400/30">
                {data.education.advantages.map((advantage, index) => (
                  <div key={index}>
                    <EditableText
                      value={advantage.title}
                      onChange={(value) => updateData({ ...data, education: { ...data.education, advantages: data.education.advantages.map((a, i) => i === index ? { ...a, title: value } : a) } })}
                      className="text-2xl font-semibold text-yellow-400 mb-4"
                      tag="h3"
                      placeholder="Avantaj Başlığı"
                    />
                    <ul className="space-y-3 text-lg mb-6">
                      {advantage.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <EditableText
                            value={item}
                            onChange={(value) => updateData({ ...data, education: { ...data.education, advantages: data.education.advantages.map((a, i) => i === index ? { ...a, items: a.items.map((it, iti) => iti === itemIndex ? value : it) } : a) } })}
                            className="text-lg"
                            tag="span"
                            placeholder="Avantaj Öğesi"
                          />
                        </li>
                      ))}
                    </ul>
                    <EditableText
                      value={advantage.quote}
                      onChange={(value) => updateData({ ...data, education: { ...data.education, advantages: data.education.advantages.map((a, i) => i === index ? { ...a, quote: value } : a) } })}
                      className="text-sm text-white/80 italic"
                      tag="p"
                      multiline
                      placeholder="Avantaj Notu"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment System Section */}
      <div 
        className={getSectionClass('paymentSystem')}
        onClick={() => onSectionClick('paymentSystem')}
      >
        <SectionIndicator sectionId="paymentSystem" title="Ödeme Sistemi" />
        <div className="bg-gradient-to-b from-white to-gray-50 py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <EditableText
              value={data.paymentSystem.title}
              onChange={(value) => updateData({ ...data, paymentSystem: { ...data.paymentSystem, title: value } })}
              className="text-4xl lg:text-5xl font-light text-center text-[#061E4F] mb-16"
              tag="h2"
              placeholder="Ödeme Sistemi Başlığı"
            />
            <EditableText
              value={data.paymentSystem.subtitle}
              onChange={(value) => updateData({ ...data, paymentSystem: { ...data.paymentSystem, subtitle: value } })}
              className="text-yellow-500"
              tag="span"
              placeholder="Ödeme Sistemi Alt Başlığı"
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {data.paymentSystem.paymentOptions.map((option, index) => (
                <div key={index} className={`bg-white p-8 rounded-none shadow-lg text-center border-l-4 border-${option.borderColor}`}>
                  <EditableText
                    value={option.title}
                    onChange={(value) => updateData({ ...data, paymentSystem: { ...data.paymentSystem, paymentOptions: data.paymentSystem.paymentOptions.map((o, i) => i === index ? { ...o, title: value } : o) } })}
                    className="text-xl font-semibold text-[#061E4F] mb-2"
                    tag="h3"
                    placeholder="Ödeme Seçeneği Başlığı"
                  />
                  <EditableText
                    value={option.description}
                    onChange={(value) => updateData({ ...data, paymentSystem: { ...data.paymentSystem, paymentOptions: data.paymentSystem.paymentOptions.map((o, i) => i === index ? { ...o, description: value } : o) } })}
                    className="text-gray-700"
                    tag="p"
                    multiline
                    placeholder="Ödeme Seçeneği Açıklaması"
                  />
                </div>
              ))}
            </div>

            <div className="bg-yellow-400/10 backdrop-blur-sm p-8 rounded-none border border-yellow-400/30 text-center">
              <EditableText
                value={data.paymentSystem.bottomQuote}
                onChange={(value) => updateData({ ...data, paymentSystem: { ...data.paymentSystem, bottomQuote: value } })}
                className="text-lg text-gray-800 leading-relaxed"
                tag="p"
                multiline
                placeholder="Ödeme Sistemi Alt Notu"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Customer Story Section */}
      <div 
        className={getSectionClass('customerStory')}
        onClick={() => onSectionClick('customerStory')}
      >
        <SectionIndicator sectionId="customerStory" title="Müşteri Hikayesi" />
        <div className="relative py-32 overflow-hidden bg-black">
          <div className="absolute inset-0">
            <div
              className="w-full h-full bg-cover bg-center opacity-70"
              style={{
                backgroundImage: data.customerStory.backgroundImage ? `url(${data.customerStory.backgroundImage})` : undefined
              }}
            />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <EditableText
              value={data.customerStory.title}
              onChange={(value) => updateData({ ...data, customerStory: { ...data.customerStory, title: value } })}
              className="text-4xl lg:text-5xl font-light mb-12 text-white leading-tight"
              tag="h2"
              placeholder="Müşteri Hikayesi Başlığı"
            />
            <EditableText
              value={data.customerStory.subtitle}
              onChange={(value) => updateData({ ...data, customerStory: { ...data.customerStory, subtitle: value } })}
              className="text-yellow-400"
              tag="span"
              placeholder="Müşteri Hikayesi Alt Başlığı"
            />
            
            <div className="bg-white/10 backdrop-blur-sm p-12 rounded-none border border-white/20">
              <EditableText
                value={data.customerStory.quote}
                onChange={(value) => updateData({ ...data, customerStory: { ...data.customerStory, quote: value } })}
                className="text-xl lg:text-2xl text-white font-light leading-relaxed mb-8 italic"
                tag="blockquote"
                multiline
                placeholder="Müşteri Hikayesi Alıntı"
              />
              <EditableText
                value={data.customerStory.author}
                onChange={(value) => updateData({ ...data, customerStory: { ...data.customerStory, author: value } })}
                className="text-yellow-400 font-semibold text-lg"
                tag="cite"
                placeholder="Müşteri Hikayesi Yazar"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div 
        className={getSectionClass('cta')}
        onClick={() => onSectionClick('cta')}
      >
        <SectionIndicator sectionId="cta" title="Son Çağrı" />
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-32">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <EditableText
              value={data.cta.title}
              onChange={(value) => updateData({ ...data, cta: { ...data.cta, title: value } })}
              className="text-4xl lg:text-6xl font-light mb-8 leading-tight"
              tag="h2"
              placeholder="Son Çağrı Başlığı"
            />
            <EditableText
              value={data.cta.description}
              onChange={(value) => updateData({ ...data, cta: { ...data.cta, description: value } })}
              className="text-xl lg:text-2xl font-light mb-12 leading-relaxed max-w-4xl mx-auto opacity-90"
              tag="p"
              multiline
              placeholder="Son Çağrı Açıklaması"
            />
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a 
                href={data.cta.primaryButtonLink}
                className="inline-flex items-center justify-center gap-3 px-12 py-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-none transition-all duration-500 text-xl"
              >
                <EditableText
                  value={data.cta.primaryButtonText}
                  onChange={(value) => updateData({ ...data, cta: { ...data.cta, primaryButtonText: value } })}
                  className="text-black"
                  placeholder="Ana Buton Metni"
                />
              </a>
              <a 
                href={data.cta.secondaryButtonLink}
                className="inline-flex items-center justify-center gap-3 px-12 py-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-none transition-all duration-500 text-xl"
              >
                <EditableText
                  value={data.cta.secondaryButtonText}
                  onChange={(value) => updateData({ ...data, cta: { ...data.cta, secondaryButtonText: value } })}
                  className="text-white"
                  placeholder="İkinci Buton Metni"
                />
              </a>
            </div>
            
            {data.cta.footerText && (
              <div className="mt-16 pt-8 border-t border-white/20">
                <EditableText
                  value={data.cta.footerText}
                  onChange={(value) => updateData({ ...data, cta: { ...data.cta, footerText: value } })}
                  className="text-lg opacity-80"
                  tag="p"
                  placeholder="Son Çağrı Alt Notu"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 