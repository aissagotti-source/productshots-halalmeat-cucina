import type { AppState, UserProfile, UserProgress } from './types'

const STORAGE_KEY = 'arabisch-avontuur-state'

const defaultProgress: UserProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastStudiedDate: '',
  completedLessons: [],
  unlockedModules: ['begroeten'],
  badges: [],
  currentCity: 'Nador',
  totalWords: 0,
  speakingAttempts: 0,
  totalDays: 0,
}

export function getState(): AppState {
  if (typeof window === 'undefined') {
    return { profile: null, progress: defaultProgress }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { profile: null, progress: defaultProgress }
    const parsed = JSON.parse(raw) as AppState
    return {
      profile: parsed.profile ?? null,
      progress: { ...defaultProgress, ...parsed.progress },
    }
  } catch {
    return { profile: null, progress: defaultProgress }
  }
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function getProfile(): UserProfile | null {
  return getState().profile
}

export function saveProfile(profile: UserProfile): void {
  const state = getState()
  saveState({ ...state, profile })
}

export function getProgress(): UserProgress {
  return getState().progress
}

export function saveProgress(progress: UserProgress): void {
  const state = getState()
  saveState({ ...state, progress })
}

export function completeLesson(lessonId: string, xpEarned: number, newWords: number): UserProgress {
  const progress = getProgress()
  const today = new Date().toISOString().split('T')[0]

  const wasStudiedToday = progress.lastStudiedDate === today
  const wasStudiedYesterday =
    progress.lastStudiedDate ===
    new Date(Date.now() - 86400000).toISOString().split('T')[0]

  const newStreak = wasStudiedToday
    ? progress.streak
    : wasStudiedYesterday
    ? progress.streak + 1
    : 1

  const newXP = progress.xp + xpEarned
  const newLevel = Math.floor(newXP / 500) + 1

  const updated: UserProgress = {
    ...progress,
    xp: newXP,
    level: newLevel,
    streak: newStreak,
    lastStudiedDate: today,
    completedLessons: progress.completedLessons.includes(lessonId)
      ? progress.completedLessons
      : [...progress.completedLessons, lessonId],
    totalWords: progress.totalWords + newWords,
    totalDays: wasStudiedToday ? progress.totalDays : progress.totalDays + 1,
    currentCity: getCityForXP(newXP),
  }

  saveProgress(updated)
  return updated
}

export function unlockModule(moduleId: string): void {
  const progress = getProgress()
  if (!progress.unlockedModules.includes(moduleId)) {
    saveProgress({
      ...progress,
      unlockedModules: [...progress.unlockedModules, moduleId],
    })
  }
}

export function addBadge(badgeId: string): void {
  const progress = getProgress()
  if (!progress.badges.includes(badgeId)) {
    saveProgress({ ...progress, badges: [...progress.badges, badgeId] })
  }
}

export function addSpeakingAttempt(): void {
  const progress = getProgress()
  saveProgress({ ...progress, speakingAttempts: progress.speakingAttempts + 1 })
}

export function clearState(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
  }
}

function getCityForXP(xp: number): string {
  if (xp >= 3000) return 'Marrakech'
  if (xp >= 2000) return 'Casablanca'
  if (xp >= 1200) return 'Fez'
  if (xp >= 600) return 'Tangier'
  if (xp >= 200) return 'Al Hoceima'
  return 'Nador'
}

export function getLevelName(level: number): string {
  const names = [
    '', 'Beginner', 'Leerling', 'Gevorderd', 'Expert', 'Meester',
    'Arabisch Ster', 'Taalwonder', 'Culturele Held', 'Marrakech Held', 'Arabische Legende',
  ]
  return names[Math.min(level, names.length - 1)] || 'Legende'
}

export function getXPForNextLevel(currentXP: number): { current: number; needed: number; progress: number } {
  const levelXP = 500
  const current = currentXP % levelXP
  const needed = levelXP
  return { current, needed, progress: (current / needed) * 100 }
}
