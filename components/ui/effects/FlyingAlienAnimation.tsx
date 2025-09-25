'use client';

import React from 'react';
import { motion } from 'framer-motion';

const MotionCircle = motion('circle');

const Satellite404Animation = () => {
  const satelliteVariants = {
    floating: {
      y: [-10, 10, -10],
      rotate: [-2, 2, -2],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <motion.svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        className="drop-shadow-2xl"
        variants={satelliteVariants}
        animate="floating"
        style={{ marginRight: '200px' }} // Przesunięcie satelity w prawo
      >
        <rect
          x="50"
          y="60"
          width="40"
          height="20"
          fill="#3B82F6"
          stroke="#1E40AF"
          strokeWidth="2"
          rx="3"
        />
        <rect
          x="25"
          y="60"
          width="25"
          height="20"
          fill="#60A5FA"
          stroke="#1E3A8A"
          strokeWidth="2"
          rx="2"
        />
        <rect
          x="90"
          y="60"
          width="25"
          height="20"
          fill="#60A5FA"
          stroke="#1E3A8A"
          strokeWidth="2"
          rx="2"
        />
        <line
          x1="70"
          y1="60"
          x2="70"
          y2="40"
          stroke="#2563EB"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {Array.from({ length: 3 }, (_, i) => (
          <MotionCircle
            key={`satellite-signal-${i + 1}`}
            cx="70" // pozycja anteny
            cy="40"
            r="10" // początkowy promień
            stroke="#3B82F6"
            strokeWidth="2"
            fill="none"
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeOut',
              delay: i * 1, // fale startują jedna po drugiej
            }}
          />
        ))}
      </motion.svg>
    </div>
  );
};

export default Satellite404Animation;
