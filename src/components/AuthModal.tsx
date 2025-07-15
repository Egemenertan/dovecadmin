'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Lock, Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
}

export default function AuthModal({ isOpen }: AuthModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockEndTime, setBlockEndTime] = useState<number | null>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  
  const { login } = useAuth();

  // Modal açıldığında input'a focus yap
  useEffect(() => {
    if (isOpen && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [isOpen]);

  // Sayfa yüklendiğinde mevcut blok durumunu kontrol et
  useEffect(() => {
    const checkBlockStatus = () => {
      const savedBlockEndTime = localStorage.getItem('dovec_admin_block_end');
      const savedAttempts = localStorage.getItem('dovec_admin_attempts');
      
      if (savedBlockEndTime) {
        const blockEnd = parseInt(savedBlockEndTime);
        const now = Date.now();
        
        if (now < blockEnd) {
          setIsBlocked(true);
          setBlockEndTime(blockEnd);
          const remainingTime = Math.ceil((blockEnd - now) / (1000 * 60 * 60)); // saat cinsinden
          setError(`Sistem 1 gün boyunca bloklandı. Kalan süre: ${remainingTime} saat`);
        } else {
          // Blok süresi dolmuş, temizle
          localStorage.removeItem('dovec_admin_block_end');
          localStorage.removeItem('dovec_admin_attempts');
          setIsBlocked(false);
          setBlockEndTime(null);
        }
      }
      
      if (savedAttempts && !isBlocked) {
        setAttempts(parseInt(savedAttempts));
      }
    };

    checkBlockStatus();
  }, []);

  // 3 yanlış deneme sonrası 1 gün (24 saat) blokla
  useEffect(() => {
    if (attempts >= 3) {
      const blockEndTime = Date.now() + (24 * 60 * 60 * 1000); // 24 saat
      setIsBlocked(true);
      setBlockEndTime(blockEndTime);
      setError('3 kez yanlış şifre girdiniz! Sistem 24 saat boyunca bloklandı.');
      
      // Local storage'a kaydet
      localStorage.setItem('dovec_admin_block_end', blockEndTime.toString());
      localStorage.setItem('dovec_admin_attempts', attempts.toString());
    }
  }, [attempts]);

  // Blok süresini real-time olarak güncelle
  useEffect(() => {
    if (isBlocked && blockEndTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = blockEndTime - now;
        
        if (remaining <= 0) {
          // Blok süresi doldu
          setIsBlocked(false);
          setBlockEndTime(null);
          setAttempts(0);
          setError('');
          localStorage.removeItem('dovec_admin_block_end');
          localStorage.removeItem('dovec_admin_attempts');
        } else {
          // Kalan süreyi güncelle
          const remainingHours = Math.ceil(remaining / (1000 * 60 * 60));
          const remainingMinutes = Math.ceil((remaining % (1000 * 60 * 60)) / (1000 * 60));
          
          if (remainingHours > 0) {
            setError(`Sistem bloklandı. Kalan süre: ${remainingHours} saat ${remainingMinutes} dakika`);
          } else {
            setError(`Sistem bloklandı. Kalan süre: ${remainingMinutes} dakika`);
          }
        }
      }, 60000); // Her dakika güncelle
      
      return () => clearInterval(interval);
    }
  }, [isBlocked, blockEndTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      return;
    }

    if (!password.trim()) {
      setError('Lütfen şifrenizi girin');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(password);
      
      if (success) {
        setPassword('');
        setAttempts(0);
        setError('');
        // Başarılı giriş sonrası attempts'i temizle
        localStorage.removeItem('dovec_admin_attempts');
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem('dovec_admin_attempts', newAttempts.toString());
        setError(`Yanlış şifre! Kalan deneme hakkı: ${3 - newAttempts}`);
        setPassword('');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200">
          {/* Header */}
          <div className="px-6 py-8 text-center border-b border-gray-100">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isBlocked 
                ? 'bg-gradient-to-br from-red-500 to-red-600' 
                : 'bg-gradient-to-br from-blue-500 to-blue-600'
            }`}>
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isBlocked ? 'Sistem Bloklandı' : 'Güvenli Giriş'}
            </h2>
            <p className="text-gray-600">
              {isBlocked 
                ? 'Çok fazla yanlış deneme yapıldı' 
                : 'Dovec Admin paneline erişmek için şifrenizi girin'
              }
            </p>
          </div>

          {/* Form */}
          <div className="px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Admin Şifresi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading || isBlocked}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder={isBlocked ? "Sistem bloklandı..." : "Şifrenizi girin..."}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || isBlocked}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                  isBlocked 
                    ? 'text-red-600 bg-red-50' 
                    : attempts > 0 
                      ? 'text-amber-600 bg-amber-50' 
                      : 'text-red-600 bg-red-50'
                }`}>
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Attempt Counter */}
              {attempts > 0 && !isBlocked && (
                <div className="text-center text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  ⚠️ Dikkat: Kalan deneme hakkı {3 - attempts} - 3 yanlış denemede sistem 24 saat bloklanır!
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isBlocked || !password.trim()}
                className={`w-full py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                  isBlocked
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Kontrol ediliyor...</span>
                  </div>
                ) : isBlocked ? (
                  '🔒 Sistem Bloklandı'
                ) : (
                  'Giriş Yap'
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
            <div className="text-center text-xs text-gray-500">
              🔒 Bu sistem SSL ile korunmaktadır - Maximum güvenlik aktif
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 