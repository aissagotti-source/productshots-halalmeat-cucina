'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Circle } from 'lucide-react'
import type { UserProgress } from '@/lib/types'

interface DailyMissionProps {
  progress: UserProgress
}

export default function DailyMission({ progress }: DailyMissionProps) {
  const todayLessons = progress.completedLessons.length

  const missions = [
    { id: 'lesson', label: 'Voltooi 1 les', done: todayLessons >= 1, xp: 20 },
    { id: 'words', label: 'Leer 5 woorden', done: progress.totalWords >= 5, xp: 15 },
    { id: 'speak', label: 'Oefen spreken', done: progress.speakingAttempts >= 1, xp: 25 },
  ]

  const completed = missions.filter(m => m.done).length
  const totalXP = missions.filter(m => m.done).reduce((acc, m) => acc + m.xp, 0)

  return (
    <div className="bg-white rounded-3xl border border-brand-100 shadow-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-black text-stone-800 text-base">🎯 Dagtaken</h3>
          <p className="text-stone-500 text-xs font-semibold">{completed}/3 voltooid</p>
        </div>
        {totalXP > 0 && (
          <div className="bg-brand-100 rounded-xl px-3 py-1">
            <p className="text-brand-700 font-black text-sm">+{totalXP} XP</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {missions.map((mission, i) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${
              mission.done ? 'bg-emerald-50' : 'bg-stone-50'
            }`}
          >
            {mission.done ? (
              <CheckCircle size={22} className="text-emerald-500 flex-shrink-0" />
            ) : (
              <Circle size={22} className="text-stone-300 flex-shrink-0" />
            )}
            <span className={`font-bold text-sm flex-1 ${mission.done ? 'text-emerald-700 line-through opacity-70' : 'text-stone-700'}`}>
              {mission.label}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${mission.done ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-100 text-brand-600'}`}>
              +{mission.xp} XP
            </span>
          </motion.div>
        ))}
      </div>

      {completed === 3 && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-3 bg-gradient-to-r from-brand-400 to-terracotta-400 rounded-2xl p-3 text-center text-white"
        >
          <p className="font-black">🏆 Alle taken voltooid!</p>
          <p className="text-sm font-semibold opacity-90">Geweldig gedaan vandaag!</p>
        </motion.div>
      )}
    </div>
  )
}
