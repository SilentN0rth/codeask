import { SvgIcon } from '@/lib/utils/icons';
import { UserInterface } from '@/types/users.types';
import { Button } from '@heroui/react';
import React from 'react';
import SafeImage from '@/components/ui/SafeImage';

const ProfileBackground = ({
  user,
  isOwnProfile,
  onEditProfile,
}: {
  user: UserInterface | null;
  isOwnProfile?: boolean;
  onEditProfile?: () => void;
}) => {
  if (!isOwnProfile && !user?.background_url) {
    return null;
  }

  if (!isOwnProfile && user?.background_url) {
    return (
      <div className="group relative col-span-full mb-4 h-72 !max-w-full overflow-hidden rounded-sm max-sm:hidden">
        <SafeImage
          alt="Tło użytkownika"
          src={user.background_url}
          classNames={{
            img: 'w-full h-full object-cover',
            wrapper: 'w-full !max-w-full h-full',
          }}
          timeout={8000}
        />
      </div>
    );
  }

  return (
    <div className="group relative col-span-full mb-6 h-72 !max-w-full overflow-hidden rounded-sm max-sm:hidden">
      <SafeImage
        alt="Tło użytkownika"
        src={user?.background_url ?? 'https://placehold.co/1600x300/0f1113/ddd'}
        classNames={{
          img: 'w-full h-full object-cover',
          wrapper: 'w-full !max-w-full h-full',
        }}
        timeout={8000}
      />
      <div
        className={`pointer-events-none absolute inset-0 z-10 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
          !user?.background_url ? 'opacity-100' : ''
        }`}
      />
      <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Button
          className="flex items-center gap-2 rounded-lg bg-black/60 px-4 py-2 text-sm text-white shadow-md hover:bg-black/70"
          onPress={onEditProfile}
        >
          <SvgIcon icon="mdi:pencil" className="text-lg" />
          {user?.background_url ? 'Edytuj tło' : 'Dodaj tło'}
        </Button>
      </div>
    </div>
  );
};

export default ProfileBackground;
