'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Flame, Star, Mic2, BookOpen, Trophy, LogOut } from 'lucide-react'
import { getProfile, getProgress, getLevelName, clearState } from '@/lib/storage'
import type { UserProfile, UserProgress } from '@/lib/types'
import ProgressBar from '@/components/ui/ProgressBar'

const PRACTICE_SENTENCES = [
  { dutch: 'Hoe zeg je hallo in het Arabisch?', arabic: 'مرحبا', transliteration: 'Marhaba' },
  { dutch: 'Vraag hoe het gaat!', arabic: 'كيف حالك؟', transliteration: 'Kayfa haluk?' },
  { dutch: 'Zeg dank je wel in Darija.', arabic: 'شكراً', transliteration: 'Shukran' },
  { dutch: 'Zeg tot ziens!', arabic: 'بسلامة', transliteration: 'Bslama' },
  { dutch: 'Hoe zeg je vader in Darija?', arabic: 'بابا', transliteration: 'Baba' },
]

export default function ParentDashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [todaySentence, setTodaySentence] = useState(PRACTICE_SENTENCES[0])
  const [showReset, setShowReset] = useState(false)

  useEffect(() => {
    const p = getProfile()
    if (!p) { router.replace('/onboarding'); return }
    setProfile(p)
    const prog = getProgress()
    setProgress(prog)
    const day = new Date().getDay()
    setTodaySentence(PRACTICE_SENTENCES[day % PRACTICE_SENTENCES.length])
  }, [router])

  const handleReset = () => {
    clearState()
    router.replace('/onboarding')
  }

  if (!profile || !progress) return null

  const levelName = getLevelName(progress.level)

  const stats = [
    { icon: <Flame size={20} className="text-orange-500" />, label: 'Dagreeks', value: progress.streak, unit: 'dagen', color: 'bg-orange-50' },
    { icon: <BookOpen size={20} className="text-brand-500" />, label: 'Woorden geleerd', value: progress.totalWords, unit: 'woorden', color: 'bg-brand-50' },
    { icon: <Mic2 size={20} className="text-teal-500" />, label: 'Spreekpogingen', value: progress.speakingAttempts, unit: 'keer', color: 'bg-teal-50' },
    { icon: <Trophy size={20} className="text-yellow-500" />, label: 'Badges verdiend', value: progress.badges.length, unit: 'badges', color: 'bg-yellow-50' },
    { icon: <Star size={20} className="text-purple-500" />, label: 'XP punten', value: progress.xp, unit: 'XP', color: 'bg-purple-50' },
    { icon: <BookOpen size={20} className="text-emerald-500" />, label: 'Lessen voltooid', value: progress.completedLessons.length, unit: 'lessen', color: 'bg-emerald-50' },
  ]

  return (
    <div className="flex-1 flex flex-col bg-brand-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-700 to-stone-800 px-5 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.push('/home')}
            className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-white"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-black text-white">Ouder Dashboard</h1>
            <p className="text-stone-300 text-xs font-semibold">Voortgang van {profile.name}</p>
          </div>
        </div>

        {/* Child profile summary */}
        <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="text-4xl">{profile.avatar}</div>
          <div>
            <p className="text-white font-black text-lg">{profile.name}</p>
            <p className="text-stone-300 text-sm font-semibold">Level {progress.level} · {levelName}</p>
            <p className="text-stone-400 text-xs">📍 {progress.currentCity}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-yellow-300 font-black text-xl">{progress.xp}</p>
            <p className="text-stone-400 text-xs font-semibold">XP totaal</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 py-4">
        {/* Level progress */}
        <div className="bg-white rounded-3xl border border-brand-100 shadow-card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-black text-stone-800">Level voortgang</h3>
            <span className="text-brand-600 font-bold text-sm">Level {progress.level}</span>
          </div>
          <ProgressBar value={progress.xp % 500} max={500} color="brand" height="lg" showLabel />
          <p className="text-stone-500 text-xs font-semibold mt-2 text-center">
            Nog {500 - (progress.xp % 500)} XP tot Level {progress.level + 1}
          </p>
        </div>

        {/* Stats grid */}
        <div>
          <h3 className="font-black text-stone-700 mb-3">Statistieken</h3>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`${stat.color} rounded-2xl p-4`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {stat.icon}
                  <span className="text-stone-600 text-xs font-bold uppercase tracking-wide">{stat.label}</span>
                </div>
                <p className="text-2xl font-black text-stone-800">
                  {stat.value}
                  <span className="text-sm font-semibold text-stone-500 ml-1">{stat.unit}</span>
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Today's practice tip */}
        <div className="bg-gradient-to-br from-brand-50 to-amber-50 rounded-3xl border border-brand-200 p-5">
          <h3 className="font-black text-stone-800 mb-1">💡 Oefen vandaag thuis</h3>
          <p className="text-stone-500 text-sm font-semibold mb-3">Stel deze vraag aan uw kind:</p>
          <div className="bg-white rounded-2xl p-3 border border-brand-100">
            <p className="font-bold text-stone-700 text-sm mb-2">&ldquo;{todaySentence.dutch}&rdquo;</p>
            <p className="arabic-text text-2xl font-black text-brand-700 text-center">{todaySentence.arabic}</p>
            <p className="text-stone-500 text-sm font-semibold text-center italic">{todaySentence.transliteration}</p>
          </div>
        </div>

        {/* Completed lessons */}
        <div className="bg-white rounded-3xl border border-brand-100 shadow-card p-4">
          <h3 className="font-black text-stone-800 mb-3">Voltooide lessen</h3>
          {progress.completedLessons.length === 0 ? (
            <p className="text-stone-400 font-semibold text-sm text-center py-4">Nog geen lessen voltooid</p>
          ) : (
            <div className="flex flex-col gap-2">
              {progress.completedLessons.map(id => (
                <div key={id} className="flex items-center gap-2 bg-emerald-50 rounded-xl px-3 py-2">
                  <span className="text-emerald-500">✓</span>
                  <span className="font-bold text-stone-700 text-sm capitalize">{id.replace(/-/g, ' ')}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips for parents */}
        <div className="bg-teal-50 rounded-3xl border border-teal-200 p-4">
          <h3 className="font-black text-teal-800 mb-2">📋 Tips voor ouders</h3>
          <ul className="space-y-2">
            {[
              'Oefen dagelijks 5-15 minuten voor het beste resultaat',
              'Spreek thuis ook Arabisch/Darija om het te versterken',
              'Vier kleine successen — elke les voltooid is een overwinning!',
              'Vraag uw kind om woorden te laten zien die ze hebben geleerd',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-teal-700 text-sm font-semibold">
                <span className="text-teal-400 mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Reset button */}
        <button
          onClick={() => setShowReset(true)}
          className="flex items-center justify-center gap-2 bg-red-50 text-red-500 font-bold py-3 rounded-2xl border border-red-200 hover:bg-red-100 transition-colors"
        >
          <LogOut size={16} /> Opnieuw beginnen
        </button>

        <div className="h-6" />
      </div>

      {/* Reset confirm modal */}
      {showReset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">⚠️</div>
              <h3 className="text-xl font-black text-stone-800">Alles wissen?</h3>
              <p className="text-stone-500 text-sm font-semibold mt-1">
                Alle voortgang, XP en badges worden verwijderd. Dit kan niet ongedaan worden gemaakt.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReset(false)}
                className="flex-1 bg-stone-100 text-stone-700 font-bold py-3 rounded-2xl"
              >
                Annuleren
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-red-500 text-white font-bold py-3 rounded-2xl"
              >
                Ja, wissen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
