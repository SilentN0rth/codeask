'use client';

import React, { useState } from 'react';
import { Textarea, Button } from '@heroui/react';

interface MessageContentProps {
  content: string;
  is_own: boolean;
  isEditing: boolean;
  onEdit: (newContent: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function MessageContent({
  content,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: MessageContentProps) {
  const [editContent, setEditContent] = useState(content);

  const handleSaveEdit = () => {
    if (editContent.trim() !== content) {
      onEdit(editContent.trim());
    }
    onSave();
  };

  const handleCancelEdit = () => {
    setEditContent(content);
    onCancel();
  };

  if (isEditing) {
    return (
      <div className="min-w-[200px]">
        <Textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          minRows={1}
          placeholder="Edytuj wiadomość..."
          className="text-base"
          classNames={{
            inputWrapper:
              'bg-cBgDark-800 border border-divider group-hover:bg-cBgDark-800/50 group-data-[focus=true]:bg-cBgDark-800/50',
            input: 'text-base text-white placeholder:text-default-500',
          }}
        />
        <div className="mt-2 flex gap-2">
          <Button
            size="sm"
            color="primary"
            variant="flat"
            onPress={handleSaveEdit}
            className="text-xs"
          >
            Zapisz
          </Button>
          <Button
            size="sm"
            variant="flat"
            onPress={handleCancelEdit}
            className="text-xs"
          >
            Anuluj
          </Button>
        </div>
      </div>
    );
  }

  return (
    <p
      className="whitespace-normal break-words text-sm"
      style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
    >
      {content}
    </p>
  );
}
