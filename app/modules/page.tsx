'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Lock } from 'lucide-react'
import { getProgress, getProfile } from '@/lib/storage'
import type { UserProgress, Module } from '@/lib/types'
import modulesData from '@/data/modules.json'

const modules = modulesData as Module[]

export default function ModulesPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    const p = getProfile()
    if (!p) { router.replace('/onboarding'); return }
    setProgress(getProgress())
  }, [router])

  if (!progress) return null

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

  return (
    <div className="flex-1 flex flex-col bg-brand-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-500 to-terracotta-400 px-5 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.push('/home')}
            className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white">Alle Modules</h1>
            <p className="text-brand-100 text-sm font-semibold">{modules.length} thema&apos;s om te ontdekken</p>
          </div>
        </div>
      </div>

      {/* Modules list */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-3 px-4 py-4 overflow-y-auto"
      >
        {modules.map((mod) => {
          const isLocked = !progress.unlockedModules.includes(mod.id)
          const completedCount = mod.lessonIds.filter(id => progress.completedLessons.includes(id)).length
          const pct = mod.lessonIds.length > 0 ? (completedCount / mod.lessonIds.length) * 100 : 0
          const xpNeeded = Math.max(0, mod.xpRequired - progress.xp)

          return (
            <motion.button
              key={mod.id}
              variants={item}
              whileTap={{ scale: 0.97 }}
              onClick={() => !isLocked && router.push(`/modules/${mod.id}`)}
              className={`w-full text-left bg-white rounded-3xl border-2 p-4 shadow-card transition-all ${
                isLocked ? 'opacity-60 border-stone-100' : 'border-brand-100 card-lift hover:border-brand-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${mod.bgColor || 'bg-brand-100'} flex-shrink-0`}>
                  {isLocked ? '🔒' : mod.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-black text-stone-800 text-base">{mod.title}</h3>
                    {isLocked ? (
                      <Lock size={16} className="text-stone-400 flex-shrink-0" />
                    ) : completedCount === mod.lessonIds.length && mod.lessonIds.length > 0 ? (
                      <span className="text-emerald-500 text-lg">✅</span>
                    ) : null}
                  </div>
                  <p className="text-stone-500 text-xs font-semibold mt-0.5 truncate">{mod.description}</p>

                  {!isLocked ? (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-stone-400">{completedCount}/{mod.lessonIds.length} lessen</span>
                        <span className="text-xs font-bold text-brand-600">{Math.round(pct)}%</span>
                      </div>
                      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-400 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-stone-400 mt-1">
                      🔒 Vereist {mod.xpRequired} XP
                      {xpNeeded > 0 && ` (nog ${xpNeeded} XP)`}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs bg-stone-100 text-stone-600 font-bold px-2 py-0.5 rounded-full">
                      📍 {mod.city}
                    </span>
                    <span className="text-xs text-stone-400 font-semibold arabic-text">{mod.titleDarija}</span>
                  </div>
                </div>
              </div>
            </motion.button>
          )
        })}
        <div className="h-6" />
      </motion.div>
    </div>
  )
}
