'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, Link, X, Image as ImageIcon, Camera, Plus } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function ImageUploader({ value, onChange, className = '' }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Base64'e çevirme fonksiyonu
  const convertToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  // Dosya validation
  const validateFile = useCallback((file: File): string | null => {
    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return 'Dosya boyutu 5MB\'dan küçük olmalıdır';
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      return 'Sadece resim dosyaları desteklenir';
    }

    // Desteklenen formatlar
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!supportedTypes.includes(file.type)) {
      return 'Desteklenen formatlar: JPG, PNG, WebP, GIF';
    }

    return null;
  }, []);

  // Dosya yükleme işlemi
  const handleFileUpload = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Base64'e çevir
      const base64String = await convertToBase64(file);
      onChange(base64String);
      
      console.log('✅ Resim başarıyla yüklendi');
    } catch (err) {
      console.error('❌ Resim yükleme hatası:', err);
      setError('Resim yüklenirken bir hata oluştu');
    } finally {
      setUploading(false);
    }
  }, [validateFile, convertToBase64, onChange]);

  // File input değişimi
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Input'u temizle
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFileUpload]);

  // Drag & Drop olayları
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  // Clipboard paste
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) {
            handleFileUpload(file);
          }
          break;
        }
      }
    }
  }, [handleFileUpload]);

  // URL'den resim ekleme
  const handleUrlSubmit = useCallback(() => {
    if (!urlInput.trim()) {
      setError('Lütfen geçerli bir URL girin');
      return;
    }

    try {
      new URL(urlInput.trim()); // URL validation
      onChange(urlInput.trim());
      setUrlInput('');
      setShowUrlInput(false);
      setError(null);
    } catch {
      setError('Geçerli bir URL girin (örn: https://example.com/image.jpg)');
    }
  }, [urlInput, onChange]);

  // Resim silme
  const handleRemoveImage = useCallback(() => {
    onChange('');
    setError(null);
    setImageError(false);
  }, [onChange]);

  // Resim yükleme durumu
  const handleImageLoad = useCallback(() => {
    console.log('✅ Resim yüklendi:', value);
    setImageLoading(false);
    setImageError(false);
  }, [value]);

  const handleImageError = useCallback(() => {
    console.log('❌ Resim yüklenemedi:', value);
    setImageLoading(false);
    setImageError(true);
  }, [value]);

  // Resim önizleme başlangıcı
  React.useEffect(() => {
    if (value) {
      console.log('🔄 Resim yükleme başlatıldı:', value);
      setImageLoading(true);
      setImageError(false);
      
      // Timeout ekle - 10 saniye sonra loading'i durdur
      const timeout = setTimeout(() => {
        console.log('⏰ Resim yükleme timeout:', value);
        setImageLoading(false);
        setImageError(true);
      }, 10000);
      
      return () => {
        clearTimeout(timeout);
      };
    } else {
      // Value yoksa loading'i sıfırla
      setImageLoading(false);
      setImageError(false);
    }
  }, [value]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mevcut resim önizleme */}
      {value && (
        <div className="relative group">
          <div className="relative overflow-hidden rounded-xl bg-slate-100 border-2 border-slate-200">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
                <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
              </div>
            )}
            
            {!imageError ? (
              <img
                src={value}
                alt="Öne çıkan resim"
                className={`w-full h-48 object-cover transition-opacity duration-300 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                <div className="text-center text-red-400">
                  <div className="w-16 h-16 bg-red-200 rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <X className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium">Resim yüklenemedi</p>
                  <p className="text-xs mt-1">URL'yi kontrol edin</p>
                </div>
              </div>
            )}

            {/* Silme butonu */}
            <button
              onClick={handleRemoveImage}
              className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
              title="Resmi kaldır"
            >
              <X size={16} />
            </button>

            {/* Resim bilgisi */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <p className="text-sm font-medium">Öne çıkan resim</p>
              <p className="text-xs opacity-90">Blog kartlarında ve detay sayfasında görüntülenecek</p>
            </div>
          </div>

          {/* Resim boyutu bilgisi */}
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>✓ Resim yüklendi</span>
            <span>{value.startsWith('data:') ? 'Yüklenen dosya' : 'URL bağlantısı'}</span>
          </div>
        </div>
      )}

      {/* Resim yükleme alanı */}
      {!value && (
        <div
          ref={dropZoneRef}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onPaste={handlePaste}
          tabIndex={0}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
            ${dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
            }
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          {uploading ? (
            <div className="space-y-4">
              <div className="w-12 h-12 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-600 font-medium">Resim yükleniyor...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Ana upload ikonu */}
              <div className="w-16 h-16 bg-slate-100 rounded-xl mx-auto flex items-center justify-center">
                <Upload className="w-8 h-8 text-slate-400" />
              </div>

              {/* Ana metin */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Resim Ekleyin
                </h3>
                <p className="text-slate-600 mb-4">
                  Dosya sürükleyip bırakın, yapıştırın veya seçin
                </p>
              </div>

              {/* Action butonları */}
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors"
                >
                  <Camera size={16} />
                  Dosya Seç
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowUrlInput(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  <Link size={16} />
                  URL Ekle
                </button>
              </div>

              {/* Kısayol bilgileri */}
              <div className="text-xs text-slate-500 space-y-1">
                <p>💡 <strong>Hızlı yüklemek için:</strong></p>
                <p>• Dosyayı buraya sürükleyip bırakın</p>
                <p>• Clipboard'dan resim yapıştırın (Ctrl+V)</p>
                <p>• Maksimum dosya boyutu: 5MB</p>
              </div>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* URL input modal */}
      {showUrlInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                URL'den Resim Ekle
              </h3>
              <button
                onClick={() => {
                  setShowUrlInput(false);
                  setUrlInput('');
                  setError(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Resim URL'si
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <p>✓ Desteklenen formatlar: JPG, PNG, WebP, GIF</p>
                <p>✓ Önerilen çözünürlük: En az 1200x675 piksel</p>
                <p>✓ Ücretsiz resim kaynakları: Unsplash, Pexels, Pixabay</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowUrlInput(false);
                    setUrlInput('');
                    setError(null);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleUrlSubmit}
                  disabled={!urlInput.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg transition-colors"
                >
                  Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Değiştirme butonları (resim varken) */}
      {value && (
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg transition-colors"
          >
            <Upload size={14} />
            Değiştir
          </button>
          
          <button
            type="button"
            onClick={() => setShowUrlInput(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg transition-colors"
          >
            <Link size={14} />
            URL ile değiştir
          </button>
        </div>
      )}

      {/* Error gösterimi */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <div className="flex items-center gap-2">
            <X size={16} className="text-red-500" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto p-1 hover:bg-red-100 rounded transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Güçlendirilmiş resim kılavuzu */}
      {!value && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <ImageIcon size={16} />
            Resim Önerileri
          </h4>
          <div className="text-xs text-blue-800 space-y-1">
            <p>• <strong>Kalite:</strong> Yüksek çözünürlüklü, net resimler</p>
            <p>• <strong>Boyut:</strong> En az 1200x675 piksel (16:9 oran)</p>
            <p>• <strong>Format:</strong> JPG (küçük dosya), PNG (şeffaflık), WebP (modern)</p>
            <p>• <strong>İçerik:</strong> Blog konusuyla ilgili, görsel olarak çekici</p>
            <p>• <strong>Boyut limiti:</strong> Maksimum 5MB</p>
          </div>
        </div>
      )}
    </div>
  );
} 