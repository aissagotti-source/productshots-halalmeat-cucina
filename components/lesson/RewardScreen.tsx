'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Zap, Home, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Lesson } from '@/lib/types'

interface RewardScreenProps {
  lesson: Lesson
  xpEarned: number
  wordsLearned: number
  onHome: () => void
  onNextLesson?: () => void
}

interface Particle {
  id: number
  x: number
  color: string
  delay: number
  size: number
}

const confettiColors = ['#F59E0B', '#EA580C', '#0D9488', '#8B5CF6', '#EC4899', '#10B981']

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    delay: Math.random() * 0.5,
    size: 6 + Math.random() * 8,
  }))
}

export default function RewardScreen({ lesson, xpEarned, wordsLearned, onHome }: RewardScreenProps) {
  const [particles] = useState(() => generateParticles(30))
  const [stars, setStars] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const timer1 = setTimeout(() => setStars(1), 400)
    const timer2 = setTimeout(() => setStars(2), 700)
    const timer3 = setTimeout(() => setStars(3), 1000)
    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3) }
  }, [])

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-brand-400 via-brand-500 to-terracotta-500 flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Confetti */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          animate={{
            y: '110vh',
            rotate: [0, 360, 720],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2.5 + Math.random(),
            delay: p.delay,
            ease: 'easeIn',
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-white text-center">
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="text-8xl"
        >
          🏆
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-4xl font-black mb-2">Les Voltooid!</h1>
          <p className="text-brand-100 text-lg font-semibold">{lesson.title}</p>
        </motion.div>

        {/* Stars */}
        <div className="flex gap-3">
          {[0, 1, 2].map(i => (
            <AnimatePresence key={i}>
              {stars > i && (
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Star size={52} className="text-yellow-300 fill-yellow-300 drop-shadow-lg" />
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex gap-4 w-full"
        >
          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap size={20} className="text-yellow-300" />
              <span className="font-black text-2xl">+{xpEarned}</span>
            </div>
            <p className="text-white/80 text-sm font-semibold">XP verdiend</p>
          </div>
          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="text-2xl font-black mb-1">📚 {wordsLearned}</div>
            <p className="text-white/80 text-sm font-semibold">Woorden geleerd</p>
          </div>
        </motion.div>

        {/* Encouraging message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="bg-white/20 rounded-2xl px-5 py-3 w-full"
        >
          <p className="font-bold text-lg">🎯 {lesson.emoji} Je bent geweldig!</p>
          <p className="text-white/80 text-sm mt-1">
            Blijf oefenen en word een Arabisch ster! ⭐
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="flex flex-col gap-3 w-full"
        >
          <button
            onClick={onHome}
            className="w-full bg-white text-brand-600 font-black text-xl py-5 rounded-3xl shadow-lg flex items-center justify-center gap-2 hover:bg-brand-50 active:scale-95 transition-all"
          >
            <Home size={22} /> Naar huis
          </button>
          <button
            onClick={() => router.push('/modules')}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw size={18} /> Meer lessen
          </button>
        </motion.div>
      </div>
    </div>
  )
}
