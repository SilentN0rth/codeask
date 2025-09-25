'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '@heroui/react';
import { useFadeIn } from '@/lib/animations/useFadeIn';

import { Message } from '@/types/chat.types';
import MessageContent from './MessageContent';
import MessageActions from './MessageActions';
import MessageMetadata from './MessageMetadata';

interface MessageBubbleProps {
  message: Message;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, newContent: string) => void;
}

export default function MessageBubble({
  message,
  onDelete,
  onEdit,
}: MessageBubbleProps) {
  const fadeIn = useFadeIn(0, 0.3);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleEditContent = (newContent: string) => {
    if (onEdit) {
      onEdit(message.id, newContent);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(message.id);
    }
  };

  return (
    <motion.div
      {...fadeIn}
      transition={{ delay: 0.3 }}
      className={`group flex ${message.is_own ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`grid max-w-[70%] grid-cols-[auto_1fr] gap-4 ${
          message.is_own ? 'flex-row-reverse' : ''
        }`}
      >
        {!message.is_own && (
          <Avatar
            src={message.sender.avatar_url ?? undefined}
            name={message.sender.username}
            size="sm"
            radius="full"
            showFallback
          />
        )}

        <div
          className={`flex flex-col ${
            message.is_own ? 'items-end' : 'items-start'
          }`}
        >
          <div
            className={`relative flex items-start gap-2 ${
              message.is_own ? 'flex-row' : ''
            }`}
          >
            <MessageActions
              is_own={message.is_own}
              isEditing={isEditing}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <div
              className={`rounded-lg px-4 py-2 ${
                message.is_own
                  ? `${
                      isEditing
                        ? 'border border-divider bg-cBgDark-700'
                        : 'bg-cCta-500'
                    } text-white`
                  : 'bg-default-100 text-default-900'
              }`}
            >
              <MessageContent
                content={message.content}
                is_own={message.is_own}
                isEditing={isEditing}
                onEdit={handleEditContent}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
              />
            </div>
          </div>

          <MessageMetadata
            senderName={message.sender.username}
            timestamp={message.timestamp}
            is_own={message.is_own}
          />
        </div>
      </div>
    </motion.div>
  );
}
