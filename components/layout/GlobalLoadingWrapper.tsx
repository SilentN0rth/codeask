'use client';

import { useAuthContext } from 'context/useAuthContext';
import GlobalLoading from '@/components/ui/GlobalLoading';
import { ReactNode, useState, useEffect } from 'react';

interface GlobalLoadingWrapperProps {
  children: ReactNode;
}

const GlobalLoadingWrapper = ({ children }: GlobalLoadingWrapperProps) => {
  const { loading } = useAuthContext();
  const [showLoading, setShowLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!loading && showLoading) {
      setIsFadingOut(true);

      const timer = setTimeout(() => {
        setShowLoading(false);
        setIsFadingOut(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [loading, showLoading]);

  if (loading || showLoading) {
    return <GlobalLoading isFadingOut={isFadingOut} />;
  }

  return <>{children}</>;
};

export default GlobalLoadingWrapper;
