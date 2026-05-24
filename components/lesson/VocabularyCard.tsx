'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, ArrowRight } from 'lucide-react'
import type { VocabularyWord } from '@/lib/types'

interface VocabularyCardProps {
  word: VocabularyWord
  wordIndex: number
  totalWords: number
  onNext: () => void
  showDarija?: boolean
}

function speakWord(text: string, lang = 'ar') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = 0.8
  utterance.pitch = 1
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

export default function VocabularyCard({
  word,
  wordIndex,
  totalWords,
  onNext,
  showDarija = true,
}: VocabularyCardProps) {
  const [flipped, setFlipped] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSpeaking(true)
    speakWord(word.arabic, 'ar')
    setTimeout(() => setSpeaking(false), 1500)
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex items-center gap-2 text-sm font-semibold text-stone-400">
        <span className="text-brand-500">{wordIndex + 1}</span>
        <span>/</span>
        <span>{totalWords}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={word.id}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full"
        >
          <div
            className="bg-white rounded-3xl border border-brand-100 shadow-card p-6 w-full cursor-pointer select-none"
            onClick={() => setFlipped(!flipped)}
          >
            {/* Emoji */}
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-8xl"
              >
                {word.emoji}
              </motion.div>
            </div>

            {/* Dutch */}
            <div className="text-center mb-4">
              <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-1">Nederlands</p>
              <p className="text-3xl font-black text-stone-800">{word.dutch}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent mb-4" />

            {/* Arabic */}
            <div className="text-center mb-3">
              <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-1">Arabisch</p>
              <p className="arabic-text text-4xl font-black text-brand-700 leading-relaxed">{word.arabic}</p>
              <p className="text-stone-500 font-semibold text-sm mt-1 italic">{word.transliteration}</p>
            </div>

            {/* Darija */}
            {showDarija && (
              <div className="bg-teal-50 rounded-2xl p-3 text-center">
                <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-1">Darija</p>
                <p className="arabic-text text-2xl font-bold text-teal-700">{word.darija}</p>
                <p className="text-teal-600 font-semibold text-xs mt-0.5 italic">{word.darijaTransliteration}</p>
              </div>
            )}

            {/* Tap hint */}
            {!flipped && (
              <p className="text-center text-xs text-stone-400 mt-3">Tik om te onthouden ✓</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Buttons */}
      <div className="flex gap-3 w-full">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleSpeak}
          className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-btn-teal"
        >
          <motion.div animate={speaking ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.4 }}>
            <Volume2 size={20} />
          </motion.div>
          {speaking ? 'Bezig...' : 'Luister'}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onNext}
          className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-btn"
        >
          {wordIndex < totalWords - 1 ? 'Volgende' : 'Klaar!'} <ArrowRight size={20} />
        </motion.button>
      </div>
    </div>
  )
}
