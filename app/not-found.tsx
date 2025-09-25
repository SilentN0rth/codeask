import React from 'react';
import { Button } from '@heroui/react';
import { SvgIcon } from '@/lib/utils/icons';
import Link from 'next/link';
import Satellite404Animation from '@/components/ui/effects/FlyingAlienAnimation';

const NotFound = () => {
  return (
    <div className="bg-cBgDark-900 relative h-full">
      <Satellite404Animation />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="bg-cBgDark-900/80 mb-8 rounded-2xl p-8 text-center">
          <h1 className="text-cTextDark-100 mb-4 text-8xl font-bold">404</h1>
          <h2 className="text-cTextDark-200 mb-4 text-3xl font-semibold">
            Strona nie została znaleziona
          </h2>
          <p className="text-default-500 max-w-lg text-xl">
            Przepraszamy, ale strona której szukasz nie istnieje lub została
            przeniesiona. Może satelita ją zgubił w kosmosie? 🚀
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            as={Link}
            href="/"
            color="primary"
            variant="solid"
            size="lg"
            startContent={<SvgIcon icon="solar:home-2-linear" width={20} />}
            className="min-w-48"
            aria-label="Powrót do strony głównej"
          >
            Powrót do strony głównej
          </Button>

          <Button
            as={Link}
            href="/questions"
            variant="bordered"
            size="lg"
            startContent={
              <SvgIcon icon="solar:question-circle-linear" width={20} />
            }
            className="min-w-48"
            aria-label="Przejdź do strony z pytaniami"
          >
            Przeglądaj pytania
          </Button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-default-400 text-sm">
            Jeśli uważasz, że to błąd, skontaktuj się z nami.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
