'use client'

import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { type ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'teal' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  fullWidth?: boolean
  className?: string
  type?: 'button' | 'submit'
  icon?: ReactNode
}

const variants = {
  primary:   'bg-brand-500 hover:bg-brand-600 text-white shadow-btn active:bg-brand-700',
  secondary: 'bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-btn-terra active:bg-terracotta-700',
  teal:      'bg-teal-600 hover:bg-teal-700 text-white shadow-btn-teal active:bg-teal-800',
  ghost:     'bg-white hover:bg-brand-50 text-brand-700 border-2 border-brand-200 active:bg-brand-100',
  danger:    'bg-red-500 hover:bg-red-600 text-white active:bg-red-700',
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-base rounded-2xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
  xl: 'px-10 py-5 text-xl rounded-3xl',
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  fullWidth = false,
  className,
  type = 'button',
  icon,
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={clsx(
        'font-bold tracking-wide transition-colors duration-150 touch-feedback select-none',
        'focus:outline-none focus:ring-4 focus:ring-brand-300 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        'flex items-center justify-center gap-2',
        className,
      )}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  )
}
