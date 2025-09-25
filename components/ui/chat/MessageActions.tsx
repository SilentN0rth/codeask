'use client';

import React from 'react';
import { Button } from '@heroui/react';
import { SvgIcon } from '@/lib/utils/icons';

interface MessageActionsProps {
  is_own: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MessageActions({
  is_own,
  isEditing,
  onEdit,
  onDelete,
}: MessageActionsProps) {
  if (!is_own || isEditing) {
    return null;
  }

  return (
    <div className="absolute right-full mr-1.5 flex flex-col gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
      <Button
        isIconOnly
        size="sm"
        variant="light"
        onPress={onEdit}
        title="Edytuj wiadomość"
        className="p-0.5 text-default-600 hover:text-blue-500"
      >
        <SvgIcon icon="mdi:pencil" className="size-5" />
      </Button>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        onPress={onDelete}
        title="Usuń wiadomość"
        className="p-0.5 text-default-600 hover:text-red-500"
      >
        <SvgIcon icon="mdi:trash-can" className="size-5" />
      </Button>
    </div>
  );
}
