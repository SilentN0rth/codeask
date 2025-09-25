'use client';

import { UserInterface } from '@/types/users.types';
import { Tooltip, Button, cn, addToast } from '@heroui/react';
import React from 'react';
import { SvgIcon } from '@/lib/utils/icons';

const LeftSidebarSignedInLoginButtons = ({
  isCompact,
  user,
  signOut,
}: {
  isCompact: boolean;
  signOut: () => Promise<void>;
  user: UserInterface | null;
}) => {
  return (
    user && (
      <Tooltip content="Wyloguj się" isDisabled={!isCompact} placement="right">
        <Button
          onPress={() => {
            void (async () => {
              await signOut();
              addToast({
                title: 'Wylogowano pomyślnie',
                description:
                  'Od teraz będziesz miał dostęp tylko do ograniczonej zawartości forum.',
                icon: <SvgIcon icon="solar:minus-circle-linear" />,
                color: 'danger',
              });
            })();
          }}
          fullWidth
          className={cn(
            'justify-start text-default-500 data-[hover=true]:bg-danger-100 data-[hover=true]:text-danger-600',
            {
              'justify-center': isCompact,
            }
          )}
          isIconOnly={isCompact}
          startContent={
            isCompact ? null : (
              <SvgIcon
                className="flex-none rotate-180 text-default-500 group-data-[hover=true]:text-danger-600"
                icon="solar:minus-circle-linear"
                width={24}
              />
            )
          }
          variant="light"
          aria-label="Wyloguj się"
        >
          {isCompact ? (
            <SvgIcon
              className="rotate-180 text-default-500 group-data-[hover=true]:text-danger-600"
              icon="solar:minus-circle-linear"
              width={24}
            />
          ) : (
            'Wyloguj się'
          )}
        </Button>
      </Tooltip>
    )
  );
};

export default LeftSidebarSignedInLoginButtons;
