'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Card,
  CardBody,
} from '@heroui/react';
import { SvgIcon } from '@/lib/utils/icons';
import { UserInterface } from '@/types/users.types';
import UserDisplay from '@/components/ui/UserDisplay';

interface UserSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (userId: string) => void;
  currentUserId: string;
  title: string;
  icon: string;
  placeholder: string;
  emptyMessage: string;
  emptyMessageSearch: string;
  buttonText: string;
  loadUsers: (userId: string, searchQuery: string) => Promise<UserInterface[]>;
}

export default function UserSelectionModal({
  isOpen,
  onClose,
  onSelectUser,
  currentUserId,
  title,
  icon,
  placeholder,
  emptyMessage,
  emptyMessageSearch,
  buttonText,
  loadUsers,
}: UserSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);

  const loadUsersData = useCallback(async () => {
    try {
      setLoading(true);

      if (!currentUserId) {
        setUsers([]);
        return;
      }

      if (currentUserId === '') {
        setUsers([]);
        return;
      }

      const allUsers = await loadUsers(currentUserId, searchQuery);

      setUsers(allUsers.slice(0, 10));
    } finally {
      setLoading(false);
    }
  }, [currentUserId, searchQuery, loadUsers]);

  useEffect(() => {
    if (isOpen) {
      void loadUsersData();
    }
  }, [isOpen, loadUsersData]);

  const handleSelectUser = () => {
    if (selectedUser) {
      onSelectUser(selectedUser.id);
      onClose();
      setSelectedUser(null);
      setSearchQuery('');
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedUser(null);
    setSearchQuery('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: 'bg-cBgDark-800 border border-divider',
        header: 'border-b border-divider',
        footer: 'border-t border-divider',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <SvgIcon icon={icon} className="text-xl text-cCta-500" />
            <span className="text-cTextDark-100">{title}</span>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-4">
            <Input
              placeholder={placeholder}
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={
                <SvgIcon icon="mdi:magnify" className="text-default-400" />
              }
              classNames={{
                input: 'text-base',
                inputWrapper: 'border border-divider bg-cBgDark-900',
              }}
            />

            <div className="flex flex-col space-y-2 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <SvgIcon
                    icon="mdi:loading"
                    className="animate-spin text-2xl text-default-400"
                  />
                </div>
              ) : users.length === 0 ? (
                <div className="py-8 text-center text-cMuted-500">
                  {searchQuery ? emptyMessageSearch : emptyMessage}
                </div>
              ) : (
                users.map((user) => (
                  <Card
                    key={user.id}
                    isPressable
                    isHoverable
                    className={`group cursor-pointer transition-all duration-300 ${
                      selectedUser?.id === user.id
                        ? 'border-cCta-500 bg-cCta-500/10'
                        : 'border-divider bg-cBgDark-900 hover:border-cCta-500/30 hover:bg-cBgDark-700'
                    }`}
                    onPress={() => setSelectedUser(user)}
                  >
                    <CardBody className="p-3">
                      <div className="flex items-center gap-4">
                        <UserDisplay
                          user={user}
                          variant="profile"
                          size="sm"
                          linkToProfile={false}
                          withIndicator
                        />
                        <div className="min-w-0 flex-1">
                          {user.bio && (
                            <p className="mt-1 truncate text-xs text-cMuted-500">
                              {user.bio}
                            </p>
                          )}
                        </div>
                        <div className="relative overflow-hidden">
                          <div className="translate-x-8 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
                            <SvgIcon
                              icon="mdi:arrow-right"
                              className="flex-shrink-0 text-cCta-500"
                            />
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))
              )}
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="light"
            onPress={handleClose}
            className="text-cMuted-500 hover:text-cTextDark-100"
          >
            Anuluj
          </Button>
          <Button
            color="primary"
            onPress={handleSelectUser}
            isDisabled={!selectedUser}
            className="hover:bg-cCta-600 bg-cCta-500"
          >
            {buttonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
