'use client';

import React from 'react';
import UserSelectionModal from './UserSelectionModal';
import { getUsersWithConversations } from '../../../supabase/services/client/chat';
import { UserInterface } from '@/types/users.types';

interface FindUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (userId: string) => void;
  currentUserId: string;
}

export default function FindUsersModal({
  isOpen,
  onClose,
  onSelectUser,
  currentUserId,
}: FindUsersModalProps) {
  const loadUsers = async (
    userId: string,
    searchQuery: string
  ): Promise<UserInterface[]> => {
    const allUsers = (await getUsersWithConversations(
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
      onSelectUser={onSelectUser}
      currentUserId={currentUserId}
      title="Znajdź użytkowników"
      icon="solar:users-group-two-rounded-outline"
      placeholder="Szukaj użytkowników z konwersacjami..."
      emptyMessage="Brak użytkowników z konwersacjami"
      emptyMessageSearch="Nie znaleziono użytkowników"
      buttonText="Wybierz użytkownika"
      loadUsers={loadUsers}
    />
  );
}
