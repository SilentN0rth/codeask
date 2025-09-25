import React, { useRef } from 'react';
import Divider from '@/components/ui/Divider';
import ProfileBackground from '@/components/layout/Profile/ProfileBackground';
import ProfileCardFull from '@/components/ui/cards/profile/ProfileCardFull';
import ProfileLatestActivity from '@/components/layout/Profile/ProfileLatestActivity';
import EditProfileForm, {
  EditProfileFormRef,
} from '@/components/layout/Profile/EditProfileForm';
import LoginPrompt from '@/components/ui/profile/LoginPrompt';
import ProfileActions from '@/components/ui/profile/ProfileActions';
import { UserInterface } from '@/types/users.types';
import ProfileLatestQuestions from '@/components/layout/Profile/ProfileLatestQuestions';

interface ProfileLayoutProps {
  user: UserInterface;
  loggedUser: UserInterface | null;
  isOwnProfile: boolean;
  isLoggedIn: boolean;
  onUserUpdated: (updatedUser: UserInterface) => void;
  onSubmit: (
    formData: Partial<UserInterface>,
    onClose: () => void
  ) => Promise<void>;
  serverError?: string | null;
}

const ProfileLayout = ({
  user,
  loggedUser,
  isOwnProfile,
  isLoggedIn,
  onSubmit,
  serverError,
}: ProfileLayoutProps) => {
  const editProfileFormRef = useRef<EditProfileFormRef>(null);

  const handleEditBackground = () => {
    editProfileFormRef.current?.focusBackgroundInput();
  };
  const dividerText = isOwnProfile
    ? 'EDYTUJ PROFIL'
    : isLoggedIn
      ? 'TWÓJ PROFIL'
      : 'DOŁĄCZ DO SPOŁECZNOŚCI';

  return (
    <div className="wrapper">
      <ProfileBackground
        user={user}
        isOwnProfile={isOwnProfile}
        onEditProfile={handleEditBackground}
      />
      <div className="grid grid-cols-[1fr,50px,1fr] items-start gap-5">
        <Divider
          as="h1"
          text={isOwnProfile ? 'TWÓJ PROFIL' : 'PRZEGLĄDASZ PROFIL UŻYTKOWNIKA'}
          position="center"
          className="col-span-full"
          orientation="horizontal"
          bgColor="bg-cBgDark-900"
          ariaHidden={false}
        />
        <ProfileCardFull
          className="z-20 col-span-full w-full xl:col-span-1"
          author={user}
        />

        <Divider
          text={dividerText}
          orientation="vertical"
          position="center"
          bgColor="bg-cBgDark-900"
          className="hidden h-full xl:col-span-1 xl:block"
        />
        <Divider
          text={dividerText}
          position="center"
          bgColor="bg-cBgDark-900"
          className="col-span-full w-full xl:hidden"
        />

        {isOwnProfile ? (
          <EditProfileForm
            ref={editProfileFormRef}
            defaultValues={{
              name: user.name,
              username: user.username,
              avatar_url: user.avatar_url,
              background_url: user.background_url,
              bio: user.bio ?? '',
              location: user.location ?? '',
              website_url: user.website_url ?? '',
              twitter_url: user.twitter_url ?? '',
              github_url: user.github_url ?? '',
              specialization: user.specialization,
            }}
            onSubmit={onSubmit}
            onClose={() => null}
            serverError={serverError}
          />
        ) : !isLoggedIn ? (
          <LoginPrompt />
        ) : (
          <ProfileActions loggedUser={loggedUser} />
        )}

        <Divider
          text="OSTATNIA AKTYWNOŚĆ"
          position="center"
          className="col-span-full"
          orientation="horizontal"
          bgColor="bg-cBgDark-900"
        />
        <ProfileLatestActivity user={user} />
        <Divider
          text="OSTATNIE PYTANIA"
          position="center"
          className="col-span-full"
          orientation="horizontal"
          bgColor="bg-cBgDark-900"
        />
        <ProfileLatestQuestions userId={user.id} />
      </div>
    </div>
  );
};

export default ProfileLayout;
