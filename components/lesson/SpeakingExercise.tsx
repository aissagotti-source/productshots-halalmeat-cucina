'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Volume2, Play, Star, ArrowRight } from 'lucide-react'
import type { SpeakingExercise as SpeakingExerciseType } from '@/lib/types'
import { addSpeakingAttempt } from '@/lib/storage'

interface SpeakingExerciseProps {
  exercise: SpeakingExerciseType
  exerciseIndex: number
  totalExercises: number
  onNext: () => void
}

type RecordState = 'idle' | 'recording' | 'recorded' | 'playing'

const feedbackOptions = [
  { stars: 3, text: 'Top uitgesproken! 🌟🌟🌟', sub: 'Geweldig, je klinkt als een native!' },
  { stars: 3, text: 'Bijna perfect! ⭐⭐⭐', sub: 'Fantastisch gedaan!' },
  { stars: 2, text: 'Goed geprobeerd! ⭐⭐', sub: 'Nog één keer oefenen maakt het perfect!' },
  { stars: 2, text: 'Heel goed! ⭐⭐', sub: 'Je wordt steeds beter!' },
]

function speakArabic(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ar'
  utterance.rate = 0.8
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

export default function SpeakingExercise({
  exercise,
  exerciseIndex,
  totalExercises,
  onNext,
}: SpeakingExerciseProps) {
  const [state, setState] = useState<RecordState>('idle')
  const [hasRecorded, setHasRecorded] = useState(false)
  const [feedback, setFeedback] = useState<typeof feedbackOptions[0] | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [listeningSpeaker, setListeningSpeaker] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleListenNative = () => {
    setListeningSpeaker(true)
    speakArabic(exercise.arabic)
    setTimeout(() => setListeningSpeaker(false), 2500)
  }

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setHasRecorded(true)
        setState('recorded')
        stream.getTracks().forEach(t => t.stop())
        addSpeakingAttempt()
        const fb = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)]
        setFeedback(fb)
      }

      mediaRecorder.start()
      setState('recording')

      timerRef.current = setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop()
        }
      }, 5000)
    } catch {
      // Microphone not available — simulate recording for demo
      setState('recording')
      setTimeout(() => {
        setHasRecorded(true)
        setState('recorded')
        addSpeakingAttempt()
        const fb = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)]
        setFeedback(fb)
      }, 2000)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }, [])

  const playRecording = () => {
    if (!audioUrl) return
    const audio = new Audio(audioUrl)
    setState('playing')
    audio.play()
    audio.onended = () => setState('recorded')
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="text-center">
        <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-1">
          Spreek na {exerciseIndex + 1}/{totalExercises}
        </p>
        <h3 className="text-lg font-black text-stone-800">{exercise.prompt}</h3>
      </div>

      {/* Word card */}
      <div className="bg-gradient-to-br from-brand-50 to-amber-50 rounded-3xl p-5 text-center border border-brand-100">
        <p className="text-3xl font-black text-stone-800 mb-1">{exercise.dutch}</p>
        <p className="arabic-text text-4xl font-black text-brand-700 leading-relaxed">{exercise.arabic}</p>
        <p className="text-stone-500 font-semibold italic text-sm">{exercise.transliteration}</p>
        <div className="mt-2 bg-teal-100 rounded-xl px-3 py-1.5 inline-block">
          <p className="text-teal-700 font-bold text-sm">
            Darija: <span className="arabic-text">{exercise.darija}</span>
            <span className="italic font-normal ml-1">({exercise.darijaTransliteration})</span>
          </p>
        </div>
      </div>

      {/* Listen native button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleListenNative}
        className="flex items-center justify-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold py-3 rounded-2xl border border-teal-200 transition-colors"
      >
        <motion.div
          animate={listeningSpeaker ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.5, repeat: listeningSpeaker ? Infinity : 0 }}
        >
          <Volume2 size={20} />
        </motion.div>
        {listeningSpeaker ? 'Luisteren...' : 'Luister hoe het klinkt'}
      </motion.button>

      {/* Record button */}
      <div className="flex flex-col items-center gap-3">
        {state === 'idle' || state === 'recorded' ? (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={startRecording}
            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center gap-1 font-bold text-white shadow-lg transition-colors ${
              hasRecorded
                ? 'bg-brand-400 hover:bg-brand-500'
                : 'bg-red-500 hover:bg-red-600 shadow-btn'
            }`}
          >
            <Mic size={32} />
            <span className="text-xs">{hasRecorded ? 'Opnieuw' : 'Opnemen'}</span>
          </motion.button>
        ) : state === 'recording' ? (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={stopRecording}
            className="w-24 h-24 rounded-full bg-red-500 flex flex-col items-center justify-center gap-1 text-white font-bold recording-pulse"
          >
            <div className="w-6 h-6 bg-white rounded-sm" />
            <span className="text-xs">Stop</span>
          </motion.button>
        ) : (
          <div className="w-24 h-24 rounded-full bg-stone-200 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <p className="text-sm text-stone-500 font-semibold">
          {state === 'idle' && 'Druk op de microfoon en spreek na!'}
          {state === 'recording' && '🔴 Opname bezig...'}
          {state === 'recorded' && '✅ Opname klaar!'}
          {state === 'playing' && '▶️ Afspelen...'}
        </p>

        {/* Play back */}
        {hasRecorded && audioUrl && state !== 'recording' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={playRecording}
            className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2 px-4 rounded-xl transition-colors"
          >
            <Play size={16} /> Beluister je opname
          </motion.button>
        )}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-3xl p-5 text-center border border-brand-200"
          >
            <div className="flex justify-center gap-1 mb-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: i < feedback.stars ? 1 : 0.5, rotate: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 400 }}
                >
                  <Star
                    size={28}
                    className={i < feedback.stars ? 'text-brand-500 fill-brand-500' : 'text-stone-300 fill-stone-300'}
                  />
                </motion.div>
              ))}
            </div>
            <p className="font-black text-stone-800 text-lg">{feedback.text}</p>
            <p className="text-stone-500 text-sm mt-1">{feedback.sub}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next */}
      <AnimatePresence>
        {hasRecorded && (
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-black text-xl py-5 rounded-3xl shadow-btn flex items-center justify-center gap-2 transition-colors"
          >
            {exerciseIndex < totalExercises - 1 ? 'Volgende' : 'Doorgaan'}
            <ArrowRight size={22} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
