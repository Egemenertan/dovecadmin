'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TrRedirectPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Ana sayfaya redirect et
    router.replace('/')
  }, [router])
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Ana sayfaya yönlendiriliyor...</p>
      </div>
    </div>
  )
} 