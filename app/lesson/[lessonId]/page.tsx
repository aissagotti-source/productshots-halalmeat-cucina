'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { X } from 'lucide-react'
import { getProfile, completeLesson } from '@/lib/storage'
import type { Lesson, LessonStep } from '@/lib/types'
import ProgressBar from '@/components/ui/ProgressBar'
import VocabularyCard from '@/components/lesson/VocabularyCard'
import ListeningExercise from '@/components/lesson/ListeningExercise'
import SpeakingExercise from '@/components/lesson/SpeakingExercise'
import MiniDialogue from '@/components/lesson/MiniDialogue'
import RewardScreen from '@/components/lesson/RewardScreen'

const LESSON_FILES: Record<string, () => Promise<{ default: Lesson }>> = {
  'begroeten-1': () => import('@/data/lessons/begroeten-1.json') as Promise<{ default: Lesson }>,
  'familie-1':   () => import('@/data/lessons/familie-1.json') as Promise<{ default: Lesson }>,
  'eten-1':      () => import('@/data/lessons/eten-1.json') as Promise<{ default: Lesson }>,
}

function buildSteps(lesson: Lesson): LessonStep[] {
  const steps: LessonStep[] = [{ type: 'intro' }]
  lesson.vocabulary.forEach((_, i) => steps.push({ type: 'vocab', index: i }))
  lesson.listeningExercises.forEach((_, i) => steps.push({ type: 'listening', index: i }))
  lesson.speakingExercises.forEach((_, i) => steps.push({ type: 'speaking', index: i }))
  steps.push({ type: 'dialogue' })
  steps.push({ type: 'reward' })
  return steps
}

export default function LessonPage() {
  const router = useRouter()
  const params = useParams()
  const lessonId = params.lessonId as string

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [steps, setSteps] = useState<LessonStep[]>([])
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [showQuit, setShowQuit] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const p = getProfile()
    if (!p) { router.replace('/onboarding'); return }

    const loader = LESSON_FILES[lessonId]
    if (!loader) { router.replace('/home'); return }

    loader().then(mod => {
      const data = (mod as unknown as Lesson) || (mod as { default: Lesson }).default
      setLesson(data)
      setSteps(buildSteps(data))
    })
  }, [lessonId, router])

  const goNext = useCallback(() => {
    setDirection(1)
    setCurrentStepIdx(prev => {
      const next = prev + 1
      if (lesson && next >= steps.length - 1) {
        completeLesson(lessonId, lesson.xpReward, lesson.vocabulary.length)
        setCompleted(true)
      }
      return Math.min(next, steps.length - 1)
    })
  }, [lesson, steps.length, lessonId])

  const handleHome = useCallback(() => {
    router.replace('/home')
  }, [router])

  if (!lesson || steps.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-brand-50">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-4">📚</div>
          <p className="text-stone-500 font-semibold">Les laden...</p>
        </div>
      </div>
    )
  }

  const currentStep = steps[currentStepIdx]
  const progress = Math.round((currentStepIdx / (steps.length - 1)) * 100)

  if (completed || currentStep.type === 'reward') {
    return (
      <RewardScreen
        lesson={lesson}
        xpEarned={lesson.xpReward}
        wordsLearned={lesson.vocabulary.length}
        onHome={handleHome}
      />
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-brand-50">
      {/* Top bar */}
      <div className="bg-white border-b border-brand-100 px-4 pt-12 pb-3 flex items-center gap-3">
        <button
          onClick={() => setShowQuit(true)}
          className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 flex-shrink-0"
        >
          <X size={16} />
        </button>
        <div className="flex-1">
          <ProgressBar value={progress} max={100} color="brand" height="md" />
        </div>
        <div className="text-xs font-bold text-stone-400 flex-shrink-0">
          {currentStepIdx}/{steps.length - 1}
        </div>
      </div>

      {/* Step type indicator */}
      <div className="px-4 pt-4 pb-2">
        {currentStep.type === 'intro' && (
          <div className="flex items-center gap-2">
            <span className="text-2xl">{lesson.emoji}</span>
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Les</p>
              <p className="font-black text-stone-800 text-lg">{lesson.title}</p>
            </div>
          </div>
        )}
        {currentStep.type === 'vocab' && (
          <div className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <p className="font-black text-stone-700">Nieuwe woorden</p>
          </div>
        )}
        {currentStep.type === 'listening' && (
          <div className="flex items-center gap-2">
            <span className="text-xl">👂</span>
            <p className="font-black text-stone-700">Luisteren & begrijpen</p>
          </div>
        )}
        {currentStep.type === 'speaking' && (
          <div className="flex items-center gap-2">
            <span className="text-xl">🎙️</span>
            <p className="font-black text-stone-700">Jouw beurt om te spreken!</p>
          </div>
        )}
        {currentStep.type === 'dialogue' && (
          <div className="flex items-center gap-2">
            <span className="text-xl">💬</span>
            <p className="font-black text-stone-700">Mini gesprek</p>
          </div>
        )}
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStepIdx}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {currentStep.type === 'intro' && (
              <div className="flex flex-col items-center gap-6 py-8 text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-7xl"
                >
                  {lesson.emoji}
                </motion.div>
                <div>
                  <h2 className="text-3xl font-black text-stone-800">{lesson.title}</h2>
                  <p className="text-stone-500 font-semibold mt-2">{lesson.description}</p>
                </div>
                <div className="bg-white rounded-2xl border border-brand-100 p-4 w-full text-left space-y-2">
                  <p className="font-black text-stone-700 text-sm">In deze les leer je:</p>
                  <div className="flex items-center gap-2">
                    <span>📖</span>
                    <span className="text-stone-600 text-sm font-semibold">{lesson.vocabulary.length} nieuwe woorden</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👂</span>
                    <span className="text-stone-600 text-sm font-semibold">{lesson.listeningExercises.length} luisteroefeningen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🎙️</span>
                    <span className="text-stone-600 text-sm font-semibold">{lesson.speakingExercises.length} spreekoefeningen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💬</span>
                    <span className="text-stone-600 text-sm font-semibold">1 mini gesprek</span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={goNext}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white font-black text-xl py-5 rounded-3xl shadow-btn transition-colors"
                >
                  🚀 Begin de les!
                </motion.button>
              </div>
            )}

            {currentStep.type === 'vocab' && currentStep.index !== undefined && (
              <div className="py-2">
                <VocabularyCard
                  word={lesson.vocabulary[currentStep.index]}
                  wordIndex={currentStep.index}
                  totalWords={lesson.vocabulary.length}
                  onNext={goNext}
                />
              </div>
            )}

            {currentStep.type === 'listening' && currentStep.index !== undefined && (
              <div className="py-2">
                <ListeningExercise
                  exercise={lesson.listeningExercises[currentStep.index]}
                  exerciseIndex={currentStep.index}
                  totalExercises={lesson.listeningExercises.length}
                  onNext={goNext}
                />
              </div>
            )}

            {currentStep.type === 'speaking' && currentStep.index !== undefined && (
              <div className="py-2">
                <SpeakingExercise
                  exercise={lesson.speakingExercises[currentStep.index]}
                  exerciseIndex={currentStep.index}
                  totalExercises={lesson.speakingExercises.length}
                  onNext={goNext}
                />
              </div>
            )}

            {currentStep.type === 'dialogue' && (
              <div className="py-2">
                <MiniDialogue dialogue={lesson.dialogue} onNext={goNext} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Quit modal */}
      <AnimatePresence>
        {showQuit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4"
            onClick={() => setShowQuit(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-4xl p-6 w-full max-w-sm shadow-2xl"
            >
              <div className="text-center mb-5">
                <div className="text-4xl mb-2">😔</div>
                <h3 className="text-xl font-black text-stone-800">Les verlaten?</h3>
                <p className="text-stone-500 font-semibold text-sm mt-1">
                  Je voortgang gaat verloren. Weet je het zeker?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowQuit(false)}
                  className="flex-1 bg-stone-100 text-stone-700 font-bold py-3 rounded-2xl hover:bg-stone-200 transition-colors"
                >
                  Nee, doorgaan!
                </button>
                <button
                  onClick={handleHome}
                  className="flex-1 bg-red-500 text-white font-bold py-3 rounded-2xl hover:bg-red-600 transition-colors"
                >
                  Ja, stoppen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
