'use client';

import { Tooltip } from '@heroui/react';
import { motion } from 'framer-motion';
import {
  BadgeType as SpecialBadgeType,
  BADGE_DEFINITIONS,
} from '@/types/badges.types';

export type BasicBadgeType = 'gold' | 'silver' | 'bronze';

export type UniversalBadgeType = BasicBadgeType | SpecialBadgeType;

interface BadgeIconProps {
  type: UniversalBadgeType;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const basicBadgeConfig = {
  gold: {
    icon: '🥇',
    color: 'text-cStatusYellow-400',
    bgColor: 'rgba(251, 191, 36, 0.2)',
    tooltip: 'Złote odznaki',
  },
  silver: {
    icon: '🥈',
    color: 'text-cMuted-300',
    bgColor: 'rgba(156, 163, 175, 0.2)',
    tooltip: 'Srebrne odznaki',
  },
  bronze: {
    icon: '🥉',
    color: 'text-orange-500',
    bgColor: 'rgba(249, 115, 22, 0.2)',
    tooltip: 'Brązowe odznaki',
  },
};

export default function BadgeIcon({
  type,
  count = 0,

  className = '',
}: BadgeIconProps) {
  const isBasicBadge = ['gold', 'silver', 'bronze'].includes(type);

  let badgeConfig;
  let tooltipText;

  if (isBasicBadge) {
    badgeConfig = basicBadgeConfig[type as BasicBadgeType];
    tooltipText = `${count} ${badgeConfig.tooltip.toLowerCase()}`;
  } else {
    const badgeDef = BADGE_DEFINITIONS[type as SpecialBadgeType];
    if (!badgeDef) {
      return null;
    }
    badgeConfig = {
      icon: badgeDef.icon,
      color: badgeDef.color,
      bgColor: badgeDef.bgColor,
      tooltip: badgeDef.name,
    };
    tooltipText = `${badgeDef.name}: ${badgeDef.description}`;
  }

  return (
    <Tooltip content={tooltipText}>
      <motion.div
        className={`flex items-center gap-1.5 ${className}`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        <span
          className={`text-xs ${badgeConfig.color} flex items-center gap-1 rounded-full border border-divider px-2 py-1`}
          style={{ backgroundColor: badgeConfig.bgColor }}
        >
          {badgeConfig.icon}
          {isBasicBadge && count > 0 && (
            <span className="text-xs font-bold text-white">{count}</span>
          )}
        </span>
      </motion.div>
    </Tooltip>
  );
}
