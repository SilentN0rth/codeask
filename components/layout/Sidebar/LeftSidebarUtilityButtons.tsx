import { SvgIcon } from '@/lib/utils/icons';
import { Button, cn } from '@heroui/react';
import React from 'react';

const LeftSidebarUtilityButtons = ({
  isCompact,
  toggleCompact,
}: {
  isCompact: boolean;
  toggleCompact: () => void;
}) => {
  return (
    <div className={isCompact ? 'flex-column' : 'gap-xsmall flex'}>
      <Button
        fullWidth
        className={cn(
          'hidden justify-start text-default-500 data-[hover=true]:text-foreground md:flex',
          {
            'justify-center': isCompact,
            'order-20': !isCompact,
          }
        )}
        isIconOnly={isCompact}
        onPress={toggleCompact}
        startContent={
          isCompact ? null : (
            <SvgIcon
              className="flex-none text-default-500"
              height={24}
              icon="solar:sidebar-minimalistic-outline"
            />
          )
        }
        variant="light"
        aria-label={isCompact ? 'Rozwiń menu' : 'Zwiń menu'}
      >
        {isCompact ? (
          <SvgIcon
            className="text-default-500"
            height={24}
            icon="solar:sidebar-minimalistic-outline"
          />
        ) : (
          'Zwiń menu'
        )}
      </Button>
    </div>
  );
};

export default LeftSidebarUtilityButtons;
