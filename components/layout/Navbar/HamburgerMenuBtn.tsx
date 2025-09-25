import { SvgIcon } from '@/lib/utils/icons';
import { HamburgerMenuBtnProps } from '@/types/navbar.types';
import { Button } from '@heroui/react';
import React from 'react';

const HamburgerMenuBtn: React.FC<HamburgerMenuBtnProps> = ({ onOpen }) => {
  return (
    <Button
      className="!h-fit !min-w-fit !bg-transparent !p-3 3xl:hidden"
      onPress={onOpen}
      startContent={<SvgIcon icon="mdi:menu" width={28} />}
    />
  );
};

export default HamburgerMenuBtn;
