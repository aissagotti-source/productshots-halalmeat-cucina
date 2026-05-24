'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { saveProfile, saveProgress, getProgress } from '@/lib/storage'

const AVATARS = ['🦁', '🦊', '🐬', '🦋', '🐢', '🦅', '🐨', '🦒', '🐙', '🦁']

const GOALS = [
  { id: 'spreken',   label: 'Arabisch spreken',     emoji: '🗣️', desc: 'Leer vloeiend praten' },
  { id: 'marokko',  label: 'Marokkaans begrijpen',  emoji: '🇲🇦', desc: 'Begrijp Darija' },
  { id: 'woorden',  label: 'Woorden leren',          emoji: '📚', desc: 'Groei je woordenschat' },
  { id: 'vakantie', label: 'Vakantie in Marokko',   emoji: '🌴', desc: 'Overleef in Marokko' },
  { id: 'familie',  label: 'Met familie praten',     emoji: '👨‍👩‍👧', desc: 'Praat met opa en oma' },
]

const avatarRows = [
  ['🦁', '🦊', '🐬', '🦋', '🐢'],
  ['🦅', '🐨', '🦒', '🐙', '🦜'],
]

type Step = 'name' | 'avatar' | 'goal' | 'ready'

const stepVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('name')
  const [direction, setDirection] = useState(1)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('🦁')
  const [goal, setGoal] = useState('')

  const goTo = (next: Step, dir = 1) => {
    setDirection(dir)
    setStep(next)
  }

  const finish = () => {
    saveProfile({
      name: name.trim() || 'Arabisch Ster',
      avatar,
      goal,
      createdAt: new Date().toISOString(),
    })
    const progress = getProgress()
    saveProgress({ ...progress, streak: 0, unlockedModules: ['begroeten'] })
    router.replace('/home')
  }

  const steps: Step[] = ['name', 'avatar', 'goal', 'ready']
  const stepIndex = steps.indexOf(step)

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-brand-400 to-brand-600 min-h-screen">
      {/* Header */}
      <div className="pt-12 pb-6 px-6 text-center">
        <motion.div
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-5xl mb-3"
        >
          🌙
        </motion.div>
        <h1 className="text-3xl font-black text-white">Arabisch Avontuur</h1>
        <p className="text-brand-100 font-semibold mt-1">Jouw avontuur begint hier!</p>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-6">
        {steps.map((s, i) => (
          <motion.div
            key={s}
            animate={{ scale: i === stepIndex ? 1.3 : 1 }}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i <= stepIndex ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Card */}
      <div className="flex-1 mx-4 mb-6">
        <div className="bg-white rounded-4xl shadow-2xl overflow-hidden h-full flex flex-col">
          <div className="flex-1 p-6">
            <AnimatePresence mode="wait" custom={direction}>
              {step === 'name' && (
                <motion.div
                  key="name"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="flex flex-col items-center gap-6 h-full"
                >
                  <div className="text-center">
                    <div className="text-6xl mb-3">👋</div>
                    <h2 className="text-2xl font-black text-stone-800">Hoe heet jij?</h2>
                    <p className="text-stone-500 font-semibold text-sm mt-1">Voer je naam in om te beginnen</p>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jouw naam..."
                    maxLength={20}
                    className="w-full text-2xl font-black text-center bg-brand-50 border-2 border-brand-200 focus:border-brand-500 rounded-2xl py-4 px-5 outline-none transition-colors text-stone-800 placeholder-stone-400"
                    onKeyDown={e => e.key === 'Enter' && name.trim() && goTo('avatar')}
                    autoFocus
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => goTo('avatar')}
                    disabled={!name.trim()}
                    className="w-full bg-brand-500 disabled:opacity-50 text-white font-black text-xl py-5 rounded-3xl shadow-btn flex items-center justify-center gap-2 transition-colors hover:bg-brand-600"
                  >
                    Doorgaan <ArrowRight size={22} />
                  </motion.button>
                </motion.div>
              )}

              {step === 'avatar' && (
                <motion.div
                  key="avatar"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="flex flex-col items-center gap-5"
                >
                  <div className="text-center">
                    <div className="text-6xl mb-2">{avatar}</div>
                    <h2 className="text-2xl font-black text-stone-800">Kies je avatar</h2>
                    <p className="text-stone-500 font-semibold text-sm">Welk dier past bij jou?</p>
                  </div>

                  {avatarRows.map((row, ri) => (
                    <div key={ri} className="flex gap-3 justify-center">
                      {row.map(a => (
                        <motion.button
                          key={a}
                          whileTap={{ scale: 0.85 }}
                          onClick={() => setAvatar(a)}
                          className={`w-14 h-14 rounded-2xl text-3xl flex items-center justify-center transition-all border-3 ${
                            avatar === a
                              ? 'bg-brand-500 border-brand-600 shadow-btn scale-110'
                              : 'bg-brand-50 border-brand-100 hover:bg-brand-100'
                          }`}
                        >
                          {a}
                        </motion.button>
                      ))}
                    </div>
                  ))}

                  <div className="flex gap-3 w-full mt-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => goTo('name', -1)}
                      className="flex-1 bg-stone-100 text-stone-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-1"
                    >
                      <ArrowLeft size={18} /> Terug
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => goTo('goal')}
                      className="flex-2 flex-grow-[2] bg-brand-500 hover:bg-brand-600 text-white font-black py-4 rounded-2xl shadow-btn flex items-center justify-center gap-1 transition-colors"
                    >
                      Doorgaan <ArrowRight size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 'goal' && (
                <motion.div
                  key="goal"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="flex flex-col gap-4"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-black text-stone-800">Wat is jouw doel?</h2>
                    <p className="text-stone-500 font-semibold text-sm mt-1">Kies het doel dat het beste bij jou past</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {GOALS.map(g => (
                      <motion.button
                        key={g.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setGoal(g.id)}
                        className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all text-left ${
                          goal === g.id
                            ? 'bg-brand-50 border-brand-400 shadow-card'
                            : 'bg-white border-stone-100 hover:border-brand-200'
                        }`}
                      >
                        <span className="text-3xl">{g.emoji}</span>
                        <div>
                          <p className="font-black text-stone-800 text-sm">{g.label}</p>
                          <p className="text-stone-500 text-xs font-semibold">{g.desc}</p>
                        </div>
                        {goal === g.id && (
                          <span className="ml-auto text-brand-500">✓</span>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => goTo('avatar', -1)}
                      className="flex-1 bg-stone-100 text-stone-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-1"
                    >
                      <ArrowLeft size={18} /> Terug
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => goTo('ready')}
                      disabled={!goal}
                      className="flex-2 flex-grow-[2] bg-brand-500 disabled:opacity-50 hover:bg-brand-600 text-white font-black py-4 rounded-2xl shadow-btn flex items-center justify-center gap-1 transition-colors"
                    >
                      Doorgaan <ArrowRight size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 'ready' && (
                <motion.div
                  key="ready"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="flex flex-col items-center gap-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="text-8xl"
                  >
                    {avatar}
                  </motion.div>
                  <div>
                    <h2 className="text-3xl font-black text-stone-800">
                      Welkom, {name || 'Avonturier'}! 🎉
                    </h2>
                    <p className="text-stone-500 font-semibold mt-2 text-sm">
                      Jouw Arabisch avontuur begint nu. Leer elke dag een beetje en word een ster!
                    </p>
                  </div>

                  <div className="bg-brand-50 rounded-2xl p-4 w-full space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔥</span>
                      <div className="text-left">
                        <p className="font-black text-stone-800 text-sm">Dagelijkse reeks</p>
                        <p className="text-stone-500 text-xs">Oefen elke dag voor een bonus!</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⭐</span>
                      <div className="text-left">
                        <p className="font-black text-stone-800 text-sm">Verdien XP punten</p>
                        <p className="text-stone-500 text-xs">Stijg van level en ontgrendel steden!</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎙️</span>
                      <div className="text-left">
                        <p className="font-black text-stone-800 text-sm">Oefen spreken</p>
                        <p className="text-stone-500 text-xs">Praat en bouw zelfvertrouwen op!</p>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={finish}
                    className="w-full bg-gradient-to-r from-brand-500 to-terracotta-500 text-white font-black text-xl py-5 rounded-3xl shadow-btn flex items-center justify-center gap-2"
                  >
                    🚀 Begin het avontuur!
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
