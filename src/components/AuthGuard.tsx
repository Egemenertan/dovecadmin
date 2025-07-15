'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';
import { Shield, Lock } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuth();

  // Authenticated durumda - çocuk component'leri göster
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Not authenticated - giriş modalını göster ve arka planı maskele
  return (
    <div className="min-h-screen">
      {/* Masked background - güvenlik için içerik gizli */}
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 35px,
              #000 35px,
              #000 70px
            )`
          }} />
        </div>
        
        {/* Security notice */}
        <div className="text-center z-10 max-w-md mx-4">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
            <Lock className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Dovec Admin Panel
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Bu alan yalnızca yetkili kullanıcılar içindir. Devam etmek için kimlik doğrulaması gereklidir.
          </p>
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
              <Shield className="w-4 h-4" />
              <span>Güvenli bağlantı aktif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal isOpen={!isAuthenticated} />
    </div>
  );
} 