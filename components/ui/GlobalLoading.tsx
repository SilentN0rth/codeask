'use client';

interface GlobalLoadingProps {
  isFadingOut?: boolean;
}

const GlobalLoading = ({ isFadingOut = false }: GlobalLoadingProps) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background ${
        isFadingOut ? 'custom-fade-out' : 'custom-fade-in'
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative grid size-16 grid-cols-2 grid-rows-2 gap-2">
          <div
            className="relative size-7 animate-pulse rounded-sm bg-default-200/50"
            style={{ animationDelay: '0ms' }}
          />
          <div
            className="relative size-7 animate-pulse rounded-sm bg-default-200/50"
            style={{ animationDelay: '200ms' }}
          />
          <div
            className="relative size-7 animate-pulse rounded-sm bg-default-200/50"
            style={{ animationDelay: '600ms' }}
          />
          <div
            className="relative size-7 animate-pulse rounded-sm bg-default-200/50"
            style={{ animationDelay: '400ms' }}
          />

          <div className="animate-mask-square absolute size-7 rounded-sm bg-cCta-500" />
        </div>
        <p className="animate-pulse text-sm text-gray-500">Trwa ładowanie...</p>
      </div>
    </div>
  );
};

export default GlobalLoading;
