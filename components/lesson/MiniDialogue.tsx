'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, ArrowRight } from 'lucide-react'
import type { DialogueLine } from '@/lib/types'

interface MiniDialogueProps {
  dialogue: DialogueLine[]
  onNext: () => void
}

function speakLine(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ar'
  utterance.rate = 0.8
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

export default function MiniDialogue({ dialogue, onNext }: MiniDialogueProps) {
  const [revealedLines, setRevealedLines] = useState(1)
  const [speakingLine, setSpeakingLine] = useState<number | null>(null)

  const revealNext = () => {
    if (revealedLines < dialogue.length) {
      setRevealedLines(r => r + 1)
    }
  }

  const handleSpeak = (line: DialogueLine, i: number) => {
    setSpeakingLine(i)
    speakLine(line.arabic)
    setTimeout(() => setSpeakingLine(null), 2500)
  }

  const allRevealed = revealedLines >= dialogue.length

  const speakerColors: Record<string, string> = {
    adult: 'bg-teal-50 border-teal-200',
    child: 'bg-brand-50 border-brand-200',
  }
  const speakerTextColors: Record<string, string> = {
    adult: 'text-teal-700',
    child: 'text-brand-700',
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="text-center">
        <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-1">Mini Gesprek</p>
        <h3 className="text-xl font-black text-stone-800">Luister en doe mee!</h3>
      </div>

      <div className="flex flex-col gap-3">
        {dialogue.slice(0, revealedLines).map((line, i) => (
          <AnimatePresence key={i}>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className={`rounded-2xl border p-4 ${speakerColors[line.speaker] || 'bg-stone-50 border-stone-200'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-black uppercase tracking-wide ${speakerTextColors[line.speaker] || 'text-stone-600'}`}>
                      {line.speakerName}
                    </span>
                    {line.speaker === 'child' && (
                      <span className="text-xs bg-brand-200 text-brand-800 font-bold px-2 py-0.5 rounded-full">Jij!</span>
                    )}
                  </div>
                  <p className="arabic-text text-xl font-bold text-stone-800 leading-relaxed">{line.arabic}</p>
                  <p className="text-stone-500 font-semibold text-xs italic mt-0.5">{line.transliteration}</p>
                  <p className="text-stone-600 font-semibold text-sm mt-1">🇳🇱 {line.dutch}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSpeak(line, i)}
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-teal-600 hover:bg-teal-50 transition-colors"
                >
                  <motion.div
                    animate={speakingLine === i ? { scale: [1, 1.4, 1] } : {}}
                    transition={{ duration: 0.5, repeat: speakingLine === i ? Infinity : 0 }}
                  >
                    <Volume2 size={18} />
                  </motion.div>
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        ))}
      </div>

      {!allRevealed ? (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={revealNext}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-black text-lg py-4 rounded-2xl shadow-btn-teal transition-colors"
        >
          Volgende zin →
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3"
        >
          <div className="bg-emerald-50 rounded-2xl p-4 text-center">
            <p className="text-emerald-700 font-black text-lg">🎉 Gesprek voltooid!</p>
            <p className="text-emerald-600 text-sm mt-1">Geweldig gedaan! Je begrijpt het gesprek.</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-black text-xl py-5 rounded-3xl shadow-btn flex items-center justify-center gap-2 transition-colors"
          >
            Klaar! <ArrowRight size={22} />
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}
