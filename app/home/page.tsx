'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Settings, Trophy, Zap, Flame } from 'lucide-react'
import { getProfile, getProgress, getLevelName, getXPForNextLevel } from '@/lib/storage'
import type { UserProfile, UserProgress } from '@/lib/types'
import ProgressBar from '@/components/ui/ProgressBar'
import MoroccoMap from '@/components/home/MoroccoMap'
import DailyMission from '@/components/home/DailyMission'
import modulesData from '@/data/modules.json'
import type { Module } from '@/lib/types'

const modules = modulesData as Module[]

const cityUnlockMap: Record<string, string[]> = {
  Nador: ['Nador'],
  'Al Hoceima': ['Nador', 'Al Hoceima'],
  Tangier: ['Nador', 'Al Hoceima', 'Tangier'],
  Fez: ['Nador', 'Al Hoceima', 'Tangier', 'Fez'],
  Casablanca: ['Nador', 'Al Hoceima', 'Tangier', 'Fez', 'Casablanca'],
  Marrakech: ['Nador', 'Al Hoceima', 'Tangier', 'Fez', 'Casablanca', 'Marrakech'],
}

export default function HomePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const p = getProfile()
    if (!p) { router.replace('/onboarding'); return }
    setProfile(p)
    const prog = getProgress()
    setProgress(prog)
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Goedemorgen')
    else if (hour < 18) setGreeting('Goedemiddag')
    else setGreeting('Goedenavond')
  }, [router])

  if (!profile || !progress) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-4xl animate-bounce">🌙</div>
      </div>
    )
  }

  const xpData = getXPForNextLevel(progress.xp)
  const levelName = getLevelName(progress.level)
  const unlockedCities = cityUnlockMap[progress.currentCity] || ['Nador']

  const nextLesson = (() => {
    for (const mod of modules) {
      if (progress.unlockedModules.includes(mod.id)) {
        for (const lid of mod.lessonIds) {
          if (!progress.completedLessons.includes(lid)) {
            return { lessonId: lid, module: mod }
          }
        }
      }
    }
    return { lessonId: 'begroeten-1', module: modules[0] }
  })()

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

  return (
    <div className="flex-1 flex flex-col bg-brand-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-500 via-brand-500 to-terracotta-400 px-5 pt-12 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8" />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-brand-100 font-semibold text-sm">{greeting},</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-3xl">{profile.avatar}</span>
              <h1 className="text-2xl font-black text-white">{profile.name}!</h1>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                Level {progress.level} · {levelName}
              </span>
            </div>
          </div>
          <button
            onClick={() => router.push('/parent')}
            className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <Settings size={18} />
          </button>
        </div>

        {/* XP bar */}
        <div className="relative mt-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <Zap size={14} className="text-yellow-300" />
              <span className="text-white font-black text-sm">{progress.xp} XP</span>
            </div>
            <span className="text-brand-100 text-xs font-semibold">Level {progress.level + 1} → {progress.xp + (xpData.needed - xpData.current)} XP</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-yellow-300 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpData.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mt-4 relative">
          <div className="flex-1 bg-white/20 rounded-2xl p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Flame size={16} className="text-orange-300" />
              <span className="text-white font-black text-lg">{progress.streak}</span>
            </div>
            <p className="text-brand-100 text-xs font-semibold">Dagreeks</p>
          </div>
          <div className="flex-1 bg-white/20 rounded-2xl p-3 text-center">
            <div className="text-white font-black text-lg">📚 {progress.totalWords}</div>
            <p className="text-brand-100 text-xs font-semibold">Woorden</p>
          </div>
          <div className="flex-1 bg-white/20 rounded-2xl p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Trophy size={16} className="text-yellow-300" />
              <span className="text-white font-black text-lg">{progress.badges.length}</span>
            </div>
            <p className="text-brand-100 text-xs font-semibold">Badges</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4 px-4 py-5"
      >
        {/* Daily lesson CTA */}
        <motion.div variants={item}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/lesson/${nextLesson.lessonId}`)}
            className="w-full bg-gradient-to-r from-brand-500 to-terracotta-500 text-white rounded-3xl p-5 text-left shadow-btn relative overflow-hidden"
          >
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl opacity-30">
              {nextLesson.module.emoji}
            </div>
            <div className="relative">
              <p className="text-brand-100 text-xs font-bold uppercase tracking-widest mb-1">📅 Dagelijkse les</p>
              <h2 className="text-2xl font-black mb-0.5">{nextLesson.module.title}</h2>
              <p className="text-brand-100 font-semibold text-sm">{nextLesson.module.description}</p>
              <div className="mt-3 bg-white/20 rounded-xl px-3 py-1.5 inline-flex items-center gap-1">
                <Zap size={14} className="text-yellow-300" />
                <span className="font-black text-sm">+75 XP verdienen</span>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* Daily missions */}
        <motion.div variants={item}>
          <DailyMission progress={progress} />
        </motion.div>

        {/* Morocco map */}
        <motion.div variants={item}>
          <MoroccoMap currentCity={progress.currentCity} unlockedCities={unlockedCities} />
        </motion.div>

        {/* Module grid */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-stone-800 text-lg">Alle modules</h3>
            <button
              onClick={() => router.push('/modules')}
              className="text-brand-600 font-bold text-sm"
            >
              Alles zien →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {modules.slice(0, 6).map((mod) => {
              const isLocked = !progress.unlockedModules.includes(mod.id)
              const completedCount = mod.lessonIds.filter(id => progress.completedLessons.includes(id)).length
              const pct = mod.lessonIds.length > 0 ? (completedCount / mod.lessonIds.length) * 100 : 0

              return (
                <motion.button
                  key={mod.id}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => !isLocked && router.push(`/modules/${mod.id}`)}
                  className={`relative p-3 rounded-2xl border-2 flex flex-col items-center gap-1 text-center transition-all ${
                    isLocked
                      ? 'bg-stone-50 border-stone-100 opacity-60'
                      : 'bg-white border-brand-100 hover:border-brand-300 shadow-card card-lift'
                  }`}
                >
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-100/60 rounded-2xl backdrop-blur-[1px]">
                      <span className="text-xl">🔒</span>
                    </div>
                  )}
                  <span className="text-3xl">{mod.emoji}</span>
                  <span className="font-black text-stone-800 text-xs leading-tight">{mod.title}</span>
                  {!isLocked && (
                    <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-400 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Bottom spacing */}
        <div className="h-6" />
      </motion.div>
    </div>
  )
}
