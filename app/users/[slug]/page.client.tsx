'use client';
import { updateUserById } from '@/services/client/users';
import { UserInterface } from '@/types/users.types';
import { useAuthContext } from 'context/useAuthContext';
import React, { useState } from 'react';
import ProfileLayout from '@/components/ui/profile/ProfileLayout';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useRouter } from 'next/navigation';
import { generateSlug } from '@/lib/utils/generateSlug';
import { supabase } from 'supabase/supabaseClient';

const PageProfileClient = ({
  user: initialUser,
}: {
  user: UserInterface | null;
}) => {
  const [user, setUser] = useState<UserInterface | null>(initialUser);
  const [serverError, setServerError] = useState<string | null>(null);
  const { updateUser } = useAuthContext();
  const { user: loggedUser } = useAuthRedirect();
  const router = useRouter();
  const isOwnProfile = loggedUser?.id === user?.id;
  const isLoggedIn = !!loggedUser;

  const handleSubmit = async (
    formData: Partial<UserInterface>,
    onClose: () => void
  ) => {
    if (!user) return;

    setServerError(null);

    try {
      let newSlug = user.profile_slug;

      if (formData.username && formData.username !== user.username) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('username', formData.username)
          .neq('id', user.id)
          .maybeSingle();

        if (existingUser) {
          setServerError('Ta nazwa użytkownika jest już zajęta. Wybierz inną.');
          return;
        }

        const baseSlug = generateSlug(formData.username);
        let slug = baseSlug;
        let counter = 2;

        let isUnique = false;
        while (!isUnique) {
          const { data } = await supabase
            .from('users')
            .select('id')
            .eq('profile_slug', slug)
            .neq('id', user.id)
            .maybeSingle();

          if (!data) {
            newSlug = slug;
            isUnique = true;
          }

          slug = `${baseSlug}-${counter}`;
          counter++;

          if (counter > 50) {
            setServerError(
              'Nie udało się wygenerować unikalnego adresu profilu. Spróbuj innej nazwy użytkownika.'
            );
            return;
          }
        }
      }
      const updateData = {
        ...formData,
        profile_slug: newSlug,
      };

      const { error } = (await updateUserById(user.id, updateData)) as {
        error: unknown;
      };

      if (!error) {
        const updatedUser = { ...user, ...updateData };
        setUser(updatedUser);

        updateUser(updatedUser);

        if (newSlug !== user.profile_slug) {
          router.push(`/users/${newSlug}`);
          return;
        }

        onClose();
      } else {
        setServerError(
          'Nie udało się zapisać zmian w profilu. Spróbuj ponownie.'
        );
      }
    } catch {
      setServerError('Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
    }
  };

  return (
    user && (
      <ProfileLayout
        user={user}
        loggedUser={loggedUser}
        isOwnProfile={isOwnProfile}
        isLoggedIn={isLoggedIn}
        onUserUpdated={setUser}
        onSubmit={handleSubmit}
        serverError={serverError}
      />
    )
  );
};

export default PageProfileClient;
