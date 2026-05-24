import { clsx } from 'clsx'
import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg' | 'none'
  hoverable?: boolean
  onClick?: () => void
}

const paddings = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-6',
}

export default function Card({ children, className, padding = 'md', hoverable = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-3xl border border-brand-100',
        'shadow-card',
        paddings[padding],
        hoverable && 'cursor-pointer card-lift hover:shadow-card-hover',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  )
}
