import React from 'react';
import { Card, CardBody } from '@heroui/react';
import Link from 'next/link';
import Divider from '@/components/ui/Divider';
import FeatureBadge from '@/components/ui/FeatureBadge';
import { UserInterface } from '@/types/users.types';

interface ProfileActionsProps {
  loggedUser: UserInterface | null;
}

const ProfileActions = ({ loggedUser }: ProfileActionsProps) => (
  <Card
    className="col-span-full border border-divider bg-cBgDark-800 xl:col-span-1"
    shadow="none"
  >
    <CardBody className="p-6 text-center">
      <Divider
        text="Twój profil"
        orientation="horizontal"
        position="center"
        bgColor="bg-cBgDark-800"
        className="mt-0"
      />
      <p className="text-cMuted-500">
        Wybierz opcję&nbsp;
        <Link
          href={`/users/${loggedUser?.profile_slug}`}
          className="text-cCta-500 underline underline-offset-2 transition"
        >
          mój profil
        </Link>{' '}
        lub{' '}
        <Link
          href="/questions/create"
          className="text-cCta-500 underline underline-offset-2 transition"
        >
          zadaj pytanie
        </Link>
        , aby zarządzać swoim kontem i aktywnie uczestniczyć w społeczności.
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
              icon: 'solar:user-linear',
              label: 'Edycja profilu',
            },
            {
              icon: 'solar:chart-outline',
              label: 'Statystyki',
            },
            {
              icon: 'solar:bookmark-linear',
              label: 'Zapisane pytania',
            },
            {
              icon: 'material-symbols:trophy-outline',
              label: 'Tablica wyników',
            },
            {
              icon: 'solar:chat-dots-linear',
              label: 'Chat AI',
            },
            {
              icon: 'solar:chat-round-dots-linear',
              label: 'Zadawanie pytań',
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
          text="Dodatkowe korzyści"
          orientation="horizontal"
          position="center"
          bgColor="bg-cBgDark-800"
        />
        <div className="flex flex-wrap gap-2">
          {[
            {
              icon: 'solar:star-linear',
              label: 'Ocena treści',
            },
            {
              icon: 'solar:message-circle-linear',
              label: 'Odpowiadanie na pytania',
            },
            {
              icon: 'solar:users-group-two-rounded-linear',
              label: 'Wsparcie społeczności',
            },
            {
              icon: 'solar:rocket-linear',
              label: 'Priorytetowe wsparcie',
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

export default ProfileActions;
