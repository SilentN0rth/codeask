'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import React from 'react';
import { SvgIcon } from '@/lib/utils/icons';

interface DeleteQuestionModalProps {
  questionTitle: string;
  questionAuthor?: {
    id: string;
    name: string;
    username: string;
  };
  currentUser?: {
    id: string;
    is_moderator?: boolean;
  };
  onConfirm: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isLoading?: boolean;
}

export default function DeleteQuestionModal({
  questionTitle,
  questionAuthor,
  currentUser,
  onConfirm,
  isOpen,
  onOpenChange,
  isLoading = false,
}: DeleteQuestionModalProps) {
  const isAdmin = currentUser?.is_moderator;
  const isAuthor =
    questionAuthor && currentUser && questionAuthor.id === currentUser.id;
  const isAdminDeletingOthers = isAdmin && !isAuthor;
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
      classNames={{
        backdrop: 'bg-danger-500/10 backdrop-blur-sm',
        base: 'border-danger-500/20 bg-cBgDark-800',
        header: 'border-b border-divider',
        body: 'py-6',
        footer: 'border-t border-divider',
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <SvgIcon
                  icon="mdi:alert-circle-outline"
                  className="text-xl text-danger-500"
                />
                <span className="font-semibold text-danger-500">
                  {isAdminDeletingOthers
                    ? 'Usuń pytanie (Administrator)'
                    : 'Usuń pytanie'}
                </span>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-3">
                <p className="text-default-600">
                  {isAdminDeletingOthers
                    ? 'Czy na pewno chcesz usunąć to pytanie jako administrator? Ta akcja jest nieodwracalna i zostanie wykonana w imieniu autora.'
                    : 'Czy na pewno chcesz usunąć to pytanie? Ta akcja jest nieodwracalna.'}
                </p>
                <div className="rounded-lg border border-danger-500/20 bg-danger-500/10 p-3">
                  <p className="text-sm font-medium text-danger-400">
                    &quot;{questionTitle}&quot;
                  </p>
                  {isAdminDeletingOthers && questionAuthor && (
                    <p className="mt-1 text-xs text-danger-300">
                      Autor: {questionAuthor.name} (@{questionAuthor.username})
                    </p>
                  )}
                </div>
                {isAdminDeletingOthers && (
                  <div className="rounded-lg border border-warning-500/20 bg-warning-500/10 p-3">
                    <div className="flex items-start gap-2">
                      <SvgIcon
                        icon="mdi:shield-crown"
                        className="mt-0.5 flex-shrink-0 text-sm text-warning-500"
                      />
                      <div className="text-sm text-warning-400">
                        <p className="mb-1 font-medium">
                          Uprawnienia administratora:
                        </p>
                        <p className="text-xs">
                          Jako administrator możesz usuwać pytania innych
                          użytkowników. Ta akcja zostanie zarejestrowana w
                          systemie.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="rounded-lg border border-warning-500/20 bg-warning-500/10 p-3">
                  <div className="flex items-start gap-2">
                    <SvgIcon
                      icon="mdi:information"
                      className="mt-0.5 flex-shrink-0 text-sm text-warning-500"
                    />
                    <div className="text-sm text-warning-400">
                      <p className="mb-1 font-medium">Co zostanie usunięte:</p>
                      <ul className="list-inside list-disc space-y-1 text-xs">
                        <li>Pytanie i jego treść</li>
                        <li>Wszystkie odpowiedzi</li>
                        <li>Komentarze i reakcje</li>
                        <li>Powiązania z tagami</li>
                        <li>Historia zapisanych pytań</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={onClose}
                isDisabled={isLoading}
              >
                Anuluj
              </Button>
              <Button
                color="danger"
                onPress={onConfirm}
                isLoading={isLoading}
                startContent={
                  !isLoading && (
                    <SvgIcon icon="mdi:delete" className="text-sm" />
                  )
                }
              >
                {isLoading ? 'Usuwanie...' : 'Usuń pytanie'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
