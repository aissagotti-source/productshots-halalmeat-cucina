export interface UserProfile {
  name: string
  avatar: string
  goal: string
  createdAt: string
}

export interface UserProgress {
  xp: number
  level: number
  streak: number
  lastStudiedDate: string
  completedLessons: string[]
  unlockedModules: string[]
  badges: string[]
  currentCity: string
  totalWords: number
  speakingAttempts: number
  totalDays: number
}

export interface AppState {
  profile: UserProfile | null
  progress: UserProgress
}

export interface VocabularyWord {
  id: string
  dutch: string
  arabic: string
  darija: string
  transliteration: string
  darijaTransliteration: string
  emoji: string
  audioFile?: string
}

export interface ListeningExercise {
  id: string
  type: 'multiple-choice' | 'tap-what-you-hear'
  questionDutch: string
  audioWord: string
  audioArabic: string
  audioDarija: string
  options: { text: string; arabic: string; isCorrect: boolean }[]
}

export interface SpeakingExercise {
  id: string
  dutch: string
  arabic: string
  darija: string
  transliteration: string
  darijaTransliteration: string
  prompt: string
}

export interface DialogueLine {
  speaker: 'child' | 'adult'
  speakerName: string
  dutch: string
  arabic: string
  darija: string
  transliteration: string
}

export interface Lesson {
  id: string
  moduleId: string
  title: string
  titleAr: string
  emoji: string
  description: string
  xpReward: number
  vocabulary: VocabularyWord[]
  listeningExercises: ListeningExercise[]
  speakingExercises: SpeakingExercise[]
  dialogue: DialogueLine[]
}

export interface Module {
  id: string
  title: string
  titleAr: string
  titleDarija: string
  emoji: string
  color: string
  bgColor: string
  city: string
  xpRequired: number
  lessonIds: string[]
  description: string
}

export type LessonStepType =
  | 'intro'
  | 'vocab'
  | 'listening'
  | 'speaking'
  | 'dialogue'
  | 'reward'

export interface LessonStep {
  type: LessonStepType
  index?: number
}
