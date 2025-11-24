'use client';

import React, { useState, useCallback } from 'react';
import { BlogFormData } from '@/types/blog';
import { translateBlogData, checkOpenAIApiKey } from '@/lib/translationService';
import ModernRichTextEditor from './ModernRichTextEditor';
import ImageUploader from './ImageUploader';

interface BlogFormProps {
  initialData?: Partial<BlogFormData>;
  onSubmit: (data: BlogFormData) => void;
  isLoading: boolean;
}

const BlogForm: React.FC<BlogFormProps> = ({
  initialData,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: initialData?.title || '',
    en_title: initialData?.en_title || '',
    pl_title: initialData?.pl_title || '',
    excerpt: initialData?.excerpt || '',
    en_excerpt: initialData?.en_excerpt || '',
    pl_excerpt: initialData?.pl_excerpt || '',
    content: initialData?.content || '',
    en_content: initialData?.en_content || '',
    pl_content: initialData?.pl_content || '',
    tags: initialData?.tags || [],
    status: initialData?.status || 'draft',
    coverImage: initialData?.coverImage || ''
  });

  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  const handleInputChange = useCallback((field: keyof BlogFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleTranslate = async () => {
    if (!checkOpenAIApiKey()) {
      setTranslationError('OpenAI API anahtarı bulunamadı. Lütfen .env.local dosyasında NEXT_PUBLIC_OPENAI_API_KEY ayarlayın.');
      return;
    }

    if (!formData.title && !formData.excerpt && !formData.content) {
      setTranslationError('Çeviri için en az bir alan dolu olmalı (başlık, özet veya içerik).');
      return;
    }

    setIsTranslating(true);
    setTranslationError(null);

    try {
      const translationData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content
      };

      const result = await translateBlogData(translationData);

      setFormData(prev => ({
        ...prev,
        en_title: result.en_title,
        en_excerpt: result.en_excerpt,
        en_content: result.en_content
      }));

    } catch (error) {
      setTranslationError(error instanceof Error ? error.message : 'Çeviri sırasında bir hata oluştu.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl border border-slate-200 shadow-lg">
      {/* Header with Translation Button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Blog Editörü
          </h2>
          <p className="text-slate-600 font-light">Modern editör ile içeriğinizi oluşturun</p>
        </div>
        
        {checkOpenAIApiKey() && (
          <button
            type="button"
            onClick={handleTranslate}
            disabled={isTranslating || isLoading}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              isTranslating
                ? 'bg-slate-400 text-white cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25'
            }`}
          >
            {isTranslating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Çevriliyor...
              </span>
            ) : (
              'TR → EN Çevir'
            )}
          </button>
        )}
      </div>

      {/* Translation Error */}
      {translationError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          {translationError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title: Turkish, English, Polish */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-3">
              Başlık (Türkçe) *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
              required
              placeholder="Blog başlığınızı yazın..."
            />
          </div>
          <div>
            <label htmlFor="en_title" className="block text-sm font-medium text-slate-700 mb-3">
              Title (English)
            </label>
            <input
              type="text"
              id="en_title"
              value={formData.en_title}
              onChange={(e) => handleInputChange('en_title', e.target.value)}
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
              placeholder="English title..."
            />
          </div>
          <div>
            <label htmlFor="pl_title" className="block text-sm font-medium text-slate-700 mb-3">
              Tytuł (Polski)
            </label>
            <input
              type="text"
              id="pl_title"
              value={formData.pl_title}
              onChange={(e) => handleInputChange('pl_title', e.target.value)}
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
              placeholder="Polski tytuł..."
            />
          </div>
        </div>

        {/* Excerpt: Turkish, English, Polish */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700 mb-3">
              Özet (Türkçe) *
            </label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              rows={4}
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all resize-none"
              required
              placeholder="Kısa ve öz bir blog özeti yazın..."
            />
          </div>
          <div>
            <label htmlFor="en_excerpt" className="block text-sm font-medium text-slate-700 mb-3">
              Excerpt (English)
            </label>
            <textarea
              id="en_excerpt"
              value={formData.en_excerpt}
              onChange={(e) => handleInputChange('en_excerpt', e.target.value)}
              rows={4}
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all resize-none"
              placeholder="English excerpt..."
            />
          </div>
          <div>
            <label htmlFor="pl_excerpt" className="block text-sm font-medium text-slate-700 mb-3">
              Streszczenie (Polski)
            </label>
            <textarea
              id="pl_excerpt"
              value={formData.pl_excerpt}
              onChange={(e) => handleInputChange('pl_excerpt', e.target.value)}
              rows={4}
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all resize-none"
              placeholder="Polski streszczenie..."
            />
          </div>
        </div>

        {/* Content: Turkish, English, Polish */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-3">
              İçerik (Türkçe) *
            </label>
            <ModernRichTextEditor
              value={formData.content}
              onChange={(value) => handleInputChange('content', value)}
              placeholder="Blog içeriğini buraya yazın..."
              className="min-h-[400px] rounded-xl border-slate-200"
            />
          </div>
          <div>
            <label htmlFor="en_content" className="block text-sm font-medium text-slate-700 mb-3">
              Content (English)
            </label>
            <ModernRichTextEditor
              value={formData.en_content}
              onChange={(value) => handleInputChange('en_content', value)}
              placeholder="English content..."
              className="min-h-[400px] rounded-xl border-slate-200"
            />
          </div>
          <div>
            <label htmlFor="pl_content" className="block text-sm font-medium text-slate-700 mb-3">
              Treść (Polski)
            </label>
            <ModernRichTextEditor
              value={formData.pl_content}
              onChange={(value) => handleInputChange('pl_content', value)}
              placeholder="Polski treść..."
              className="min-h-[400px] rounded-xl border-slate-200"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-3">
            Etiketler
          </label>
          <input
            type="text"
            id="tags"
            value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
            onChange={(e) => {
              const tagsString = e.target.value;
              const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
              handleInputChange('tags', tagsArray);
            }}
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
            placeholder="react, javascript, web (virgülle ayırın)"
          />
          <p className="text-xs text-slate-500 mt-2">
            Etiketleri virgülle ayırarak yazın
          </p>
        </div>

        {/* Featured Image */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Öne Çıkan Resim
          </label>
          <ImageUploader
            value={formData.coverImage}
            onChange={(value) => handleInputChange('coverImage', value)}
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-3">
            Yayın Durumu
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all bg-white"
          >
            <option value="draft">📝 Taslak</option>
            <option value="published">✅ Yayınlanmış</option>
            <option value="archived">📁 Arşivlenmiş</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-slate-200">
          <button
            type="submit"
            disabled={isLoading || isTranslating}
            className={`px-8 py-4 rounded-xl font-medium transition-all duration-200 ${
              isLoading || isTranslating
                ? 'bg-slate-400 text-white cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-lg shadow-slate-900/25'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Kaydediliyor...
              </span>
            ) : (
              'Blog Yayınla'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm; 