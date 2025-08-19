import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
}

const Card: React.FC<CardProps> = ({ children, className, hover = false, glass = false }) => {
  const baseClasses = 'rounded-2xl border border-slate-200 shadow-lg'
  const glassClasses = glass ? 'glass-card' : 'bg-white'
  const hoverClasses = hover ? 'card-hover' : ''

  return (
    <motion.div
      className={cn(baseClasses, glassClasses, hoverClasses, className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

export default Card