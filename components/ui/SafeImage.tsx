'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Image } from '@heroui/react';

interface SafeImageProps {
  src?: string;
  alt: string;
  fallbackSrc?: string;
  classNames?: {
    img?: string;
    wrapper?: string;
  };
  className?: string;
  timeout?: number;
  onError?: () => void;
  onLoad?: () => void;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src = '',
  alt,
  fallbackSrc = 'https://placehold.co/1600x300/0f1113/ddd',
  classNames,
  timeout = 10000, // 10 sekund domyślnie
  onError,
  onLoad,
}) => {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [, setHasError] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setIsLoading(true);
      setHasError(false);
    }
    onError?.();
  }, [currentSrc, fallbackSrc, onError]);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setIsLoading(true);
    setHasError(false);

    timeoutRef.current = setTimeout(() => {
      if (isLoading) {
        handleError();
      }
    }, timeout);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [src, fallbackSrc, timeout]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onLoad?.();
  };

  return (
    <>
      <Image
        loading="lazy"
        ref={imgRef}
        alt={alt}
        src={currentSrc}
        classNames={classNames}
        onLoad={handleLoad}
        onError={handleError}
        isBlurred={isLoading}
        isZoomed={false}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-cBgDark-800/50">
          <div className="size-8 animate-spin rounded-full border-b-2 border-cCta-500" />
        </div>
      )}
    </>
  );
};

export default SafeImage;
