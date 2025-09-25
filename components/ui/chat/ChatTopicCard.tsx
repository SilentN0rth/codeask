'use client';

import React from 'react';
import { Card, CardBody, Avatar, Chip } from '@heroui/react';
import { motion } from 'framer-motion';

interface ChatTopicCardProps {
  topic: {
    id: string;
    name: string;
    participants: number;
    lastActivity: string;
  };
  onClick?: () => void;
  isActive?: boolean;
}

export default function ChatTopicCard({
  topic,
  onClick,
  isActive = false,
}: ChatTopicCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Card
        shadow="none"
        className={`cursor-pointer border border-divider bg-cBgDark-800 transition-all duration-300 hover:border-cCta-500/30 hover:bg-cCta-500/10 ${
          isActive ? 'border-cCta-500/50 bg-cCta-500/10' : ''
        }`}
        onClick={onClick}
      >
        <CardBody className="p-3 sm:p-4">
          <div className="flex flex-col gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar
                src={`https://i.pravatar.cc/150?img=${topic.id}`}
                name={topic.name}
                size="sm"
                radius="full"
                showFallback
                className="flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-medium text-default-900">
                  {topic.name}
                </h4>
                <p className="text-xs text-default-600">
                  {topic.participants} uczestników
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Chip
                size="sm"
                variant="flat"
                className={`text-xs ${
                  isActive ? 'bg-cCta-500/20 text-cCta-500' : ''
                }`}
              >
                {topic.lastActivity}
              </Chip>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
