'use client';

import { motion } from 'framer-motion';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Loading({ size = 'md', className = '' }: LoadingProps) {
  const sizeClasses = {
    sm: 'size-2',
    md: 'size-3',
    lg: 'size-4',
  };

  const dotVariants = {
    pulse: {
      scale: [1, 1.5, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <motion.div
      animate="pulse"
      transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
      className={`flex items-center justify-center gap-4 ${className}`}
    >
      <motion.div
        variants={dotVariants}
        className={`${sizeClasses[size]} rounded-full bg-cCta-500`}
      />
      <motion.div
        variants={dotVariants}
        className={`${sizeClasses[size]} rounded-full bg-cCta-500`}
      />
      <motion.div
        variants={dotVariants}
        className={`${sizeClasses[size]} rounded-full bg-cCta-500`}
      />
    </motion.div>
  );
}
