'use client';

import React from 'react';
import { formatTimeHelper as formatTime } from '@/lib/utils/formatDate';

interface MessageMetadataProps {
  senderName: string;
  timestamp: Date;
  is_own: boolean;
}

export default function MessageMetadata({
  senderName,
  timestamp,
  is_own,
}: MessageMetadataProps) {
  return (
    <div
      className={`mt-1 flex items-center gap-2 ${
        is_own ? 'justify-end' : 'justify-start'
      }`}
    >
      {!is_own && (
        <span className="text-xs text-default-500">{senderName}</span>
      )}
      <span className="text-xs text-default-500">{formatTime(timestamp)}</span>
    </div>
  );
}
