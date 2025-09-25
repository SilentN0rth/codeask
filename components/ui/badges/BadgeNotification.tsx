'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardBody } from '@heroui/react';
import { BadgeType, BADGE_DEFINITIONS } from '@/types/badges.types';
import { BadgeAwardResult } from '@/services/server/badges';

interface BadgeNotificationProps {
  badgeResult: BadgeAwardResult | null;
  onClose: () => void;
}

export default function BadgeNotification({
  badgeResult,
  onClose,
}: BadgeNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (badgeResult?.success && badgeResult.badgeType) {
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [badgeResult, onClose]);

  if (!badgeResult?.success || !badgeResult.badgeType) {
    return null;
  }

  const badgeDef = BADGE_DEFINITIONS[badgeResult.badgeType as BadgeType];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Card className="border border-yellow-300 bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  <span className="text-2xl">{badgeDef.icon}</span>
                </motion.div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">
                    🎉 Nowa Odznaka!
                  </h3>
                  <p className="text-sm text-white/90">{badgeDef.name}</p>
                  <p className="mt-1 text-xs text-white/80">
                    {badgeDef.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                  }}
                  className="text-white/80 transition-colors hover:text-white"
                >
                  <span className="text-white/80 transition-colors hover:text-white">
                    ✕
                  </span>
                </button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
