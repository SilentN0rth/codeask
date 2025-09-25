'use client';

import React from 'react';
import UserSelectionModal from './UserSelectionModal';
import { UserInterface } from '@/types/users.types';
import { getUsersWithoutConversations } from '../../../supabase/services/client/chat';

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartConversation: (userId: string) => void;
  currentUserId: string;
}

export default function NewConversationModal({
  isOpen,
  onClose,
  onStartConversation,
  currentUserId,
}: NewConversationModalProps) {
  const loadUsers = async (
    userId: string,
    searchQuery: string
  ): Promise<UserInterface[]> => {
    const allUsers = (await getUsersWithoutConversations(
      userId
    )) as UserInterface[];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return allUsers.filter(
        (user: UserInterface) =>
          user.name?.toLowerCase().includes(query) ||
          user.username?.toLowerCase().includes(query)
      );
    }

    return allUsers;
  };

  return (
    <UserSelectionModal
      isOpen={isOpen}
      onClose={onClose}
      onSelectUser={onStartConversation}
      currentUserId={currentUserId}
      title="Rozpocznij nową konwersację"
      icon="mdi:plus"
      placeholder="Szukaj użytkowników..."
      emptyMessage="Brak dostępnych użytkowników"
      emptyMessageSearch="Nie znaleziono użytkowników"
      buttonText="Rozpocznij konwersację"
      loadUsers={loadUsers}
    />
  );
}
