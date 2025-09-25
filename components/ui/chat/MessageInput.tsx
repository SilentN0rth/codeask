'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Input, Button } from '@heroui/react';
import { SvgIcon } from '@/lib/utils/icons';

interface MessageInputProps {
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  isSending?: boolean;
}

export default function MessageInput({
  newMessage,
  onMessageChange,
  onSendMessage,
  isSending = false,
}: MessageInputProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || isProcessing || isSending) return;

    setIsProcessing(true);
    try {
      onSendMessage();

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } finally {
      setIsProcessing(false);
    }
  }, [newMessage, onSendMessage, isProcessing, isSending]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  return (
    <div className="border-t border-default-200 p-4">
      <div className="flex gap-3">
        <Input
          ref={inputRef}
          placeholder="Napisz wiadomość..."
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
          classNames={{
            input: 'text-base',
            inputWrapper: 'bg-cBgDark-800 border border-divider',
          }}
        />
        <Button
          color="primary"
          onPress={handleSendMessage}
          isDisabled={!newMessage.trim() || isProcessing || isSending}
          isLoading={isProcessing || isSending}
        >
          {!isProcessing && !isSending && (
            <SvgIcon icon="mynaui:send-outline" />
          )}
        </Button>
      </div>
    </div>
  );
}
