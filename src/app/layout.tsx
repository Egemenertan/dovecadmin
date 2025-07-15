import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import AuthGuard from '@/components/AuthGuard'

export const metadata: Metadata = {
  title: 'Dovec Admin - Blog Management System',
  description: 'Modern blog management system with translation capabilities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="stylesheet" href="/test.css" />
      </head>
      <body className="bg-gray-50 min-h-screen">
        <AuthProvider>
          <AuthGuard>
            <div className="min-h-screen">
              {children}
            </div>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  )
} 