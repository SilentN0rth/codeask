import { Tooltip, Button, cn } from '@heroui/react';

import React, { useState } from 'react';
import LoginModal from '../Login/LoginModal';
import RegisterModal from '../Login/RegisterModal';
import { UserInterface } from '@/types/users.types';
import { SvgIcon } from '@/lib/utils/icons';

const LeftSidebarSignedOutLoginButtons = ({
  isCompact,
  user,
}: {
  isCompact: boolean;
  user: UserInterface | null;
}) => {
  const [modalOpen, setModalOpen] = useState<'login' | 'register' | null>(null);
  return (
    <div className={isCompact ? 'flex-column' : 'gap-xsmall flex'}>
      {!user && (
        <>
          <Tooltip content="Zaloguj" isDisabled={!isCompact} placement="right">
            <Button
              onPress={() => setModalOpen('login')}
              fullWidth
              className={cn(
                'justify-start text-default-500 data-[hover=true]:text-foreground',
                {
                  'justify-center': isCompact,
                }
              )}
              isIconOnly={isCompact}
              startContent={
                isCompact ? null : (
                  <SvgIcon
                    className="flex-none text-default-500"
                    icon="solar:login-2-linear"
                    width={24}
                  />
                )
              }
              variant="light"
            >
              {isCompact ? (
                <SvgIcon
                  className="text-default-500"
                  icon="solar:login-2-linear"
                  width={24}
                />
              ) : (
                'Zaloguj'
              )}
            </Button>
          </Tooltip>
          <LoginModal
            isOpen={modalOpen === 'login'}
            onClose={() => setModalOpen(null)}
          />
          <RegisterModal
            isOpen={modalOpen === 'register'}
            onClose={() => setModalOpen(null)}
          />

          <Tooltip
            content="Zarejestruj"
            isDisabled={!isCompact}
            placement="right"
          >
            <Button
              onPress={() => setModalOpen('register')}
              fullWidth
              className={cn(
                'justify-start text-default-500 data-[hover=true]:text-foreground',
                {
                  'justify-center': isCompact,
                }
              )}
              isIconOnly={isCompact}
              startContent={
                isCompact ? null : (
                  <SvgIcon
                    className="flex-none text-default-500"
                    icon="solar:user-plus-linear"
                    width={24}
                  />
                )
              }
              variant="light"
            >
              {isCompact ? (
                <SvgIcon
                  className="text-default-500"
                  icon="solar:user-plus-linear"
                  width={24}
                />
              ) : (
                'Zarejestruj'
              )}
            </Button>
          </Tooltip>
        </>
      )}
    </div>
  );
};

export default LeftSidebarSignedOutLoginButtons;
