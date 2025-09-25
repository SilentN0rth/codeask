'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export function useNavigationProgress() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  const startProgress = useCallback(() => {
    setIsLoading(true);
    setProgress(0);

    const timers = [
      setTimeout(() => setProgress(15), 50),
      setTimeout(() => setProgress(35), 150),
      setTimeout(() => setProgress(55), 250),
      setTimeout(() => setProgress(75), 350),
      setTimeout(() => setProgress(90), 450),
      setTimeout(() => {
        setProgress(100);

        setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 150);
      }, 550),
    ];

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    const cleanup = startProgress();
    return cleanup;
  }, [pathname, startProgress]);

  return {
    isLoading,
    progress,
    startProgress,
  };
}
