export interface HamburgerMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onOpen: () => void;
}

export interface HamburgerMenuBtnProps {
  onOpen: () => void;
}
