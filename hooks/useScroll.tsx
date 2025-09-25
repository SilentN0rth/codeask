import { useState, useEffect, useCallback, useRef } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

export function useScrollPosition(): ScrollPosition {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const updateScrollPosition = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', updateScrollPosition, {
        passive: true,
      });
      updateScrollPosition();
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', updateScrollPosition);
      }
    };
  }, []);

  return scrollPosition;
}

export function useScrollState(options: {
  threshold?: number;
  debounceMs?: number;
  onScroll?: (scrollY: number) => void;
}) {
  const { threshold = 50, debounceMs = 200, onScroll } = options;
  const { y: scrollY } = useScrollPosition();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const newHasScrolled = scrollY > threshold;
    const newIsAtTop = scrollY === 0;

    setHasScrolled(newHasScrolled);
    setIsAtTop(newIsAtTop);

    if (onScroll) {
      onScroll(scrollY);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {}, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [scrollY, threshold, debounceMs, onScroll]);

  return {
    scrollY,
    hasScrolled,
    isAtTop,
  };
}

export function useStickyMenu(options: {
  threshold?: number;
  debounceMs?: number;
  userToggledSticky?: boolean;
}) {
  const {
    threshold = 50,
    debounceMs = 200,
    userToggledSticky = false,
  } = options;
  const [isSticky, setIsSticky] = useState(true);
  const [isTooltipDisabled, setIsTooltipDisabled] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { scrollY, hasScrolled, isAtTop } = useScrollState({
    threshold,
    debounceMs,
    onScroll: (scrollY) => {
      if (scrollY === 0 && !userToggledSticky) {
        setIsSticky(true);
      }

      setIsTooltipDisabled(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsTooltipDisabled(false);
      }, debounceMs);
    },
  });

  const toggleSticky = useCallback(() => {
    setIsSticky((prev) => !prev);
  }, []);

  return {
    scrollY,
    hasScrolled,
    isAtTop,
    isSticky,
    isTooltipDisabled,
    toggleSticky,
    setIsSticky,
  };
}
