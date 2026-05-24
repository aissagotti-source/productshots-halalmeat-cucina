'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Play, CheckCircle, Lock, Zap } from 'lucide-react'
import { getProgress, getProfile } from '@/lib/storage'
import type { UserProgress, Module } from '@/lib/types'
import modulesData from '@/data/modules.json'

const modules = modulesData as Module[]

const lessonMeta: Record<string, { title: string; desc: string; xp: number }> = {
  'begroeten-1': { title: 'Eerste begroetingen', desc: 'Hallo, hoe gaat het, tot ziens', xp: 75 },
  'begroeten-2': { title: 'Formeel en informeel', desc: 'Mannelijk, vrouwelijk, groepen', xp: 75 },
  'familie-1':   { title: 'Mijn familie', desc: 'Vader, moeder, broer, zus, opa', xp: 75 },
  'familie-2':   { title: 'Uitgebreide familie', desc: 'Oom, tante, neef, nicht', xp: 75 },
  'eten-1':      { title: 'Basisvoedsel', desc: 'Brood, water, thee, lekker!', xp: 75 },
  'eten-2':      { title: 'In het restaurant', desc: 'Bestellen en betalen', xp: 75 },
  'thuis-1':     { title: 'Thuis in Marokko', desc: 'Kamers, meubels, dagelijks leven', xp: 75 },
  'school-1':    { title: 'Op school', desc: 'Boek, pen, leraar, leren', xp: 75 },
  'straat-1':    { title: 'De souk', desc: 'Kopen, verkopen, prijzen', xp: 75 },
  'vakantie-1':  { title: 'Naar Marokko!', desc: 'Luchthaven, taxi, hotel', xp: 75 },
  'opaoma-1':    { title: 'Bij opa en oma', desc: 'Familiergesprekken', xp: 75 },
  'islam-1':     { title: 'Dagelijkse woorden', desc: 'Bismillah, inshallah, hamdullah', xp: 75 },
}

export default function ModuleDetailPage() {
  const router = useRouter()
  const params = useParams()
  const moduleId = params.moduleId as string
  const [progress, setProgress] = useState<UserProgress | null>(null)

  const mod = modules.find(m => m.id === moduleId)

  useEffect(() => {
    const p = getProfile()
    if (!p) { router.replace('/onboarding'); return }
    setProgress(getProgress())
  }, [router])

  if (!mod || !progress) return null

  const isModuleLocked = !progress.unlockedModules.includes(mod.id)

  return (
    <div className="flex-1 flex flex-col bg-brand-50">
      {/* Header */}
      <div className={`px-5 pt-12 pb-6 bg-gradient-to-br from-brand-500 to-terracotta-400`}>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.push('/modules')}
            className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="text-4xl">{mod.emoji}</div>
          <div>
            <h1 className="text-xl font-black text-white">{mod.title}</h1>
            <p className="text-brand-100 text-xs font-semibold">{mod.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
            📍 {mod.city}
          </span>
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full arabic-text">
            {mod.titleAr}
          </span>
        </div>
      </div>

      {/* Lessons */}
      <div className="flex flex-col gap-3 px-4 py-4 overflow-y-auto">
        <h2 className="font-black text-stone-700 text-base">Lessen</h2>

        {mod.lessonIds.map((lessonId, i) => {
          const meta = lessonMeta[lessonId]
          const isCompleted = progress.completedLessons.includes(lessonId)
          const isAvailable = !isModuleLocked && (i === 0 || progress.completedLessons.includes(mod.lessonIds[i - 1]))
          const isLocked = !isAvailable

          const hasFile = ['begroeten-1', 'familie-1', 'eten-1'].includes(lessonId)

          return (
            <motion.button
              key={lessonId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => !isLocked && hasFile && router.push(`/lesson/${lessonId}`)}
              className={`w-full text-left bg-white rounded-2xl border-2 p-4 shadow-card transition-all ${
                isLocked ? 'opacity-50 border-stone-100' : isCompleted ? 'border-emerald-200' : 'border-brand-100 hover:border-brand-300 card-lift'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                  isCompleted ? 'bg-emerald-100' : isLocked ? 'bg-stone-100' : 'bg-brand-100'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="text-emerald-500" size={24} />
                  ) : isLocked ? (
                    <Lock className="text-stone-400" size={20} />
                  ) : (
                    <Play className="text-brand-600" size={22} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-stone-800 text-sm">{meta?.title || lessonId}</h3>
                    <div className="flex items-center gap-1">
                      <Zap size={12} className="text-brand-400" />
                      <span className="text-xs font-bold text-brand-500">{meta?.xp || 75}</span>
                    </div>
                  </div>
                  <p className="text-stone-500 text-xs font-semibold mt-0.5">{meta?.desc || ''}</p>
                  {!hasFile && !isLocked && (
                    <span className="text-xs text-stone-400 font-semibold">Binnenkort beschikbaar</span>
                  )}
                </div>
              </div>
            </motion.button>
          )
        })}

        {isModuleLocked && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
            <p className="text-amber-700 font-black">🔒 Module vergrendeld</p>
            <p className="text-amber-600 text-sm font-semibold mt-1">
              Je hebt {mod.xpRequired} XP nodig. Jij hebt nu {progress.xp} XP.
            </p>
            <p className="text-amber-500 text-xs mt-1">Voltooi meer lessen om te ontgrendelen!</p>
          </div>
        )}

        <div className="h-6" />
      </div>
    </div>
  )
}
