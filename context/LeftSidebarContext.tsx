'use client';

import { SidebarContextType } from '@/types/sidebar.types';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useIsMobile } from '@/hooks/useWindowSize';

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isCollapsed, setCollapsed] = useState(false);

  const isMobile = useIsMobile();

  const isCompact = isCollapsed || isMobile;

  const value = useMemo(
    () => ({
      isCompact,
      isCollapsed,
      toggleCompact: () => setCollapsed((prev) => !prev),
      setCollapsed,
    }),
    [isCompact, isCollapsed]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context)
    throw new Error('useSidebarContext must be used within SidebarProvider');
  return context;
};
