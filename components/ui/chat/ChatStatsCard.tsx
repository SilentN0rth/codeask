'use client';

import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { SvgIcon } from '@/lib/utils/icons';

interface ChatStatsCardProps {
  icon: string;
  title: string;
  value: number | string;
  iconColor?: string;
  delay?: number;
}

export default function ChatStatsCard({
  icon,
  title,
  value,
  iconColor = 'text-cCta-500',
}: ChatStatsCardProps) {
  return (
    <Card
      shadow="none"
      className="border border-divider bg-cBgDark-800 transition-all duration-300 hover:border-cCta-500/30"
    >
      <CardBody className="p-2 sm:p-3 md:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="rounded-full bg-cCta-500/20 p-1.5 sm:p-2">
            <SvgIcon
              icon={icon}
              className={`${iconColor} text-sm sm:text-base md:text-lg`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-cMuted-500 sm:text-xs">
              {title}
            </p>
            <p className="truncate text-sm font-bold text-cTextDark-100 sm:text-base md:text-xl">
              {value}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
