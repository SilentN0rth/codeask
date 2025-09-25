import { useState, useEffect, useCallback } from 'react';

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize();
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return windowSize;
}

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'unknown';

export function useResponsiveBreakpoint(): Breakpoint {
  const { width } = useWindowSize();

  const getBreakpoint = useCallback(() => {
    if (width === undefined) return 'unknown';
    if (width < 640) return 'sm';
    if (width < 768) return 'md';
    if (width < 1024) return 'lg';
    if (width < 1280) return 'xl';
    if (width < 1660) return '2xl';
    if (width < 1920) return '3xl';
    return '4xl';
  }, [width]);

  const [breakpoint, setBreakpoint] = useState<Breakpoint>(getBreakpoint());

  useEffect(() => {
    setBreakpoint(getBreakpoint());
  }, [getBreakpoint]);

  return breakpoint;
}

export function useVisibleCount(maxCount: number): number {
  const breakpoint = useResponsiveBreakpoint();

  const getCount = useCallback(() => {
    switch (breakpoint) {
      case 'sm':
        return 2;
      case 'md':
        return 4;
      case 'lg':
        return 6;
      case 'xl':
      case '2xl':
      case '3xl':
      case '4xl':
        return maxCount;
      default:
        return 4;
    }
  }, [breakpoint, maxCount]);

  const [count, setCount] = useState(getCount());

  useEffect(() => {
    setCount(getCount());
  }, [getCount]);

  return count;
}

export function useIsMobile(): boolean {
  const breakpoint = useResponsiveBreakpoint();
  return breakpoint === 'sm' || breakpoint === 'md';
}

export function useIsLargeScreen(): boolean {
  const breakpoint = useResponsiveBreakpoint();
  return (
    breakpoint === 'lg' ||
    breakpoint === 'xl' ||
    breakpoint === '2xl' ||
    breakpoint === '3xl' ||
    breakpoint === '4xl'
  );
}
