import type { Metadata } from 'next'
import './globals.css'

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
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
} 