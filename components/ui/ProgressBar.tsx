'use client';

import { useNavigationProgress } from '@/hooks/useNavigationProgress';

interface ProgressBarProps {
  className?: string;
}

export default function ProgressBar({ className = '' }: ProgressBarProps) {
  const { isLoading, progress } = useNavigationProgress();

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-x-0 top-0 z-[101] h-1 bg-transparent ${className}`}
    >
      <div
        className="h-full bg-gradient-to-r from-cCta-700 via-cCta-500 to-cCta-300 transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow:
            '0 0 6px rgba(29, 78, 216, 0.3), 0 0 12px rgba(37, 99, 235, 0.2)',
        }}
      />
    </div>
  );
}
