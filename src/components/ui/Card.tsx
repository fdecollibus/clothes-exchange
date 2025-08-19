import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, scale: 1.02 } : undefined}
      className={cn(
        'bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden',
        hover && 'transition-all duration-300 hover:shadow-xl',
        className
      )}
    >
      {children}
    </motion.div>
  )
}