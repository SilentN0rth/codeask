import React from 'react';
import { Card, CardBody } from '@heroui/react';
import Link from 'next/link';
import Divider from '@/components/ui/Divider';
import FeatureBadge from '@/components/ui/FeatureBadge';

const LoginPrompt = () => (
  <Card
    className="col-span-full border border-divider bg-cBgDark-800 xl:col-span-1"
    shadow="none"
  >
    <CardBody className="p-6 text-center">
      <Divider
        text="Dołącz do społeczności"
        orientation="horizontal"
        position="center"
        bgColor="bg-cBgDark-800"
        className="mt-0"
      />
      <p className="text-cMuted-500">
        <Link
          href="/login"
          className="text-cCta-500 underline underline-offset-2 transition hover:underline"
        >
          Zaloguj się
        </Link>{' '}
        lub{' '}
        <Link
          href="/signup"
          className="text-cCta-500 underline underline-offset-2 transition hover:underline"
        >
          zarejestruj się
        </Link>
        , aby móc edytować swój profil, zadawać pytania i odpowiadać na nie.
      </p>

      <div className="flex flex-wrap justify-center text-xs">
        <Divider
          text="Dostępne funkcje"
          orientation="horizontal"
          position="center"
          bgColor="bg-cBgDark-800"
        />
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            {
              icon: 'solar:chat-round-dots-linear',
              label: 'Zadawania pytań',
            },
            {
              icon: 'solar:message-circle-linear',
              label: 'Odpowiadania',
            },
            {
              icon: 'solar:star-linear',
              label: 'Oceny treści',
            },
            {
              icon: 'material-symbols:trophy-outline',
              label: 'Tablicy wyników',
            },
            {
              icon: 'solar:chat-dots-linear',
              label: 'Czatu AI',
            },
            {
              icon: 'solar:bookmark-linear',
              label: 'Zapisywania',
            },
            {
              icon: 'prime:plus-circle',
              label: 'Oraz innych',
            },
          ].map((item) => (
            <FeatureBadge
              key={item.label}
              icon={item.icon}
              label={item.label}
              variant="default"
            />
          ))}
        </div>

        <Divider
          text="Dodatkowe korzyści dla nowych użytkowników"
          orientation="horizontal"
          position="center"
          bgColor="bg-cBgDark-800"
        />
        <div className="flex flex-wrap gap-2">
          {[
            {
              icon: 'solar:gift-linear',
              label: 'Dostęp do specjalnych bonusów i nagród',
            },
            {
              icon: 'solar:rocket-linear',
              label: 'Priorytetowe wsparcie',
            },
            {
              icon: 'solar:users-group-two-rounded-linear',
              label: 'Wsparcie społeczności',
            },
            {
              icon: 'solar:star-fall-linear',
              label: 'Unikalna odznaka dla nowych',
            },
          ].map((item) => (
            <FeatureBadge
              key={item.label}
              icon={item.icon}
              label={item.label}
              variant="accent"
            />
          ))}
        </div>
      </div>
    </CardBody>
  </Card>
);

export default LoginPrompt;
