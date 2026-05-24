'use client'

import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface ProgressBarProps {
  value: number
  max?: number
  color?: 'brand' | 'teal' | 'terracotta' | 'green'
  height?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
  animated?: boolean
}

const colors = {
  brand:      'bg-brand-500',
  teal:       'bg-teal-500',
  terracotta: 'bg-terracotta-500',
  green:      'bg-emerald-500',
}

const tracks = {
  brand:      'bg-brand-100',
  teal:       'bg-teal-100',
  terracotta: 'bg-terracotta-100',
  green:      'bg-emerald-100',
}

const heights = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
}

export default function ProgressBar({
  value,
  max = 100,
  color = 'brand',
  height = 'md',
  showLabel = false,
  className,
  animated = true,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs font-semibold text-stone-500 mb-1">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div className={clsx('w-full rounded-full overflow-hidden shadow-inner-soft', tracks[color], heights[height])}>
        <motion.div
          className={clsx('h-full rounded-full', colors[color])}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: animated ? 0.8 : 0, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
