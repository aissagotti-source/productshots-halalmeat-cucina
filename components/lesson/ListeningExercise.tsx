'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, CheckCircle, XCircle } from 'lucide-react'
import type { ListeningExercise as ListeningExerciseType } from '@/lib/types'
import { clsx } from 'clsx'

interface ListeningExerciseProps {
  exercise: ListeningExerciseType
  exerciseIndex: number
  totalExercises: number
  onNext: () => void
}

function speakArabic(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ar'
  utterance.rate = 0.75
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

export default function ListeningExercise({
  exercise,
  exerciseIndex,
  totalExercises,
  onNext,
}: ListeningExerciseProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [speaking, setSpeaking] = useState(false)
  const answered = selected !== null
  const isCorrect = selected !== null && exercise.options[selected].isCorrect

  const handleSpeak = () => {
    setSpeaking(true)
    speakArabic(exercise.audioArabic)
    setTimeout(() => setSpeaking(false), 2000)
  }

  const handleSelect = (i: number) => {
    if (answered) return
    setSelected(i)
  }

  const feedbackMessages = {
    correct: ['Super goed! 🌟', 'Geweldig! 🎉', 'Fantastisch! ✨', 'Top! 🏆'],
    wrong: ['Bijna! Probeer nog een keer.', 'Niet helemaal. Luister nog eens!', 'Oefening baart kunst!'],
  }
  const feedback = isCorrect
    ? feedbackMessages.correct[exerciseIndex % feedbackMessages.correct.length]
    : feedbackMessages.wrong[exerciseIndex % feedbackMessages.wrong.length]

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="text-center">
        <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-1">
          Luisteroefening {exerciseIndex + 1}/{totalExercises}
        </p>
        <h3 className="text-xl font-black text-stone-800">{exercise.questionDutch}</h3>
      </div>

      {/* Audio player button */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={handleSpeak}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-3xl p-6 flex flex-col items-center gap-3 shadow-btn-teal transition-colors"
      >
        <motion.div
          animate={speaking ? { scale: [1, 1.3, 1, 1.3, 1] } : {}}
          transition={{ duration: 1, repeat: speaking ? Infinity : 0 }}
        >
          <Volume2 size={40} />
        </motion.div>
        <div>
          <p className="font-black text-xl">{speaking ? 'Luisteren...' : 'Tik om te luisteren'}</p>
          <p className="arabic-text text-2xl font-bold mt-1 opacity-90">{exercise.audioArabic}</p>
          <p className="text-teal-200 text-sm font-semibold italic">{exercise.audioWord}</p>
        </div>
      </motion.button>

      {/* Answer options */}
      <div className="grid grid-cols-2 gap-3">
        {exercise.options.map((option, i) => {
          const isSelected = selected === i
          const showCorrect = answered && option.isCorrect
          const showWrong = answered && isSelected && !option.isCorrect

          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(i)}
              className={clsx(
                'p-4 rounded-2xl font-bold text-sm border-2 transition-all duration-200',
                !answered && 'bg-white border-brand-100 hover:border-brand-300 hover:bg-brand-50 text-stone-700',
                showCorrect && 'bg-emerald-50 border-emerald-400 text-emerald-700',
                showWrong && 'bg-red-50 border-red-400 text-red-700',
                answered && !showCorrect && !showWrong && 'bg-white border-stone-100 text-stone-400 opacity-60',
              )}
            >
              <div className="flex flex-col items-center gap-1">
                {showCorrect && <CheckCircle size={18} className="text-emerald-500" />}
                {showWrong && <XCircle size={18} className="text-red-500" />}
                <span className="text-base font-black">{option.text}</span>
                <span className="arabic-text text-lg font-bold text-stone-500">{option.arabic}</span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
              'rounded-2xl p-4 text-center font-bold',
              isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700',
            )}
          >
            <p className="text-lg">{feedback}</p>
            {!isCorrect && (
              <p className="text-sm mt-1 font-semibold opacity-80">
                Het antwoord is: <span className="font-black">{exercise.options.find(o => o.isCorrect)?.text}</span>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next button */}
      <AnimatePresence>
        {answered && (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-black text-xl py-5 rounded-3xl shadow-btn transition-colors"
          >
            {exerciseIndex < totalExercises - 1 ? 'Volgende vraag →' : 'Doorgaan →'}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
