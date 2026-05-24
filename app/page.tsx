'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getProfile } from '@/lib/storage'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const profile = getProfile()
    if (profile) {
      router.replace('/home')
    } else {
      router.replace('/onboarding')
    }
  }, [router])

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🌙</div>
        <p className="text-brand-600 font-bold text-lg">Arabisch Avontuur</p>
        <p className="text-stone-500 text-sm mt-1">Laden...</p>
      </div>
    </div>
  )
}
