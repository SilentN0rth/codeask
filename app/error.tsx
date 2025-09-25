'use client';

import React from 'react';
import { Button } from '@heroui/react';
import { SvgIcon } from '@/lib/utils/icons';
import Link from 'next/link';
import Satellite404Animation from '@/components/ui/effects/FlyingAlienAnimation';

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <div className="relative h-full bg-cBgDark-900">
      <Satellite404Animation />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="mb-8 rounded-2xl bg-cBgDark-900/80 p-8 text-center">
          <h1 className="mb-4 text-8xl font-bold text-cTextDark-100">500</h1>
          <h2 className="text-cTextDark-200 mb-4 text-3xl font-semibold">
            Wystąpił błąd
          </h2>
          <p className="max-w-lg text-xl text-default-500">
            Przepraszamy, ale wystąpił nieoczekiwany błąd. Satelita ma problemy
            z komunikacją! 🚀
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            onPress={reset}
            color="primary"
            variant="solid"
            size="lg"
            startContent={<SvgIcon icon="solar:refresh-linear" width={20} />}
            className="min-w-48"
            aria-label="Spróbuj ponownie załadować stronę"
          >
            Spróbuj ponownie
          </Button>

          <Button
            as={Link}
            href="/"
            variant="bordered"
            size="lg"
            startContent={<SvgIcon icon="solar:home-2-linear" width={20} />}
            className="min-w-48"
            aria-label="Powrót do strony głównej"
          >
            Powrót do strony głównej
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 max-w-2xl rounded-lg border border-warning-200 bg-warning-50/90 p-4 text-left backdrop-blur-sm">
            <h3 className="mb-2 text-sm font-semibold text-warning-800">
              Szczegóły błędu:
            </h3>
            <p className="break-all font-mono text-xs text-warning-700">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-1 text-xs text-warning-600">
                ID błędu: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm text-default-400">
            Jeśli problem się powtarza, skontaktuj się z pomocą techniczną.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error;
