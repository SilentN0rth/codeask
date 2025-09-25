import { type ListboxProps, type ListboxSectionProps } from '@heroui/react';
import React from 'react';
import { UserInterface } from './users.types';

export enum SidebarItemType {
  Nest = 'nest',
}

export type SidebarItem = {
  key: string;
  title: string;
  icon?: string;
  href?: string;
  visibleIn?: ('left' | 'right')[]; // określa, w których sidebarach jest widoczny
  type?: SidebarItemType; // tutaj można mieć różne typy (np. Nest)
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  'aria-label'?: string;
  items?: SidebarItem[];
  className?: string;
  isClickable?: boolean; // czy element ma być klikalny (dla elementów informacyjnych)
  isSelectable?: boolean; // czy element może być wybrany w Listbox
};

export type SidebarProps = Omit<ListboxProps<SidebarItem>, 'children'> & {
  items: SidebarItem[];
  isCompact?: boolean;
  hideEndContent?: boolean;
  iconClassName?: string;
  sectionClasses?: ListboxSectionProps['classNames'];
  classNames?: ListboxProps<SidebarItem>['classNames'];
  defaultSelectedKey: string;
  onSelect?: (key: string) => void;
  topUsers?: UserInterface[];
};

export type SidebarContextType = {
  isCompact: boolean;
  isCollapsed: boolean;
  toggleCompact: () => void;
  setCollapsed: (value: boolean) => void;
};
