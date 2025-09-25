'use client';

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Input,
  Textarea,
  Button,
  Card,
  CardBody,
  CardFooter,
} from '@heroui/react';
import { SvgIcon } from '@/lib/utils/icons';
import ErrorMessage from '@/components/ui/ErrorMessage';

// Zod schema
const editProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Imię musi mieć co najmniej 2 znaki')
    .max(50, 'Imię nie może mieć więcej niż 50 znaków')
    .regex(/^[a-zA-Ząćęłńóśźżź\s\-']+$/, 'Imię zawiera niedozwolone znaki'),

  username: z
    .string()
    .min(3, 'Nazwa użytkownika musi mieć co najmniej 3 znaki')
    .max(20, 'Nazwa użytkownika nie może mieć więcej niż 20 znaków')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Dozwolone są tylko litery, cyfry i podkreślenie'
    ),

  avatar_url: z.string().url('Nieprawidłowy URL avatara').or(z.literal('')),
  background_url: z.string().url('Nieprawidłowy URL tła').or(z.literal('')),
  bio: z.string().max(300, 'Bio może mieć maksymalnie 300 znaków').optional(),
  location: z
    .string()
    .max(50, 'Lokalizacja może mieć maksymalnie 50 znaków')
    .optional(),
  website_url: z.string().url('Nieprawidłowy URL strony').or(z.literal('')),
  twitter_url: z.string().url('Nieprawidłowy URL Twittera').or(z.literal('')),
  github_url: z.string().url('Nieprawidłowy URL GitHuba').or(z.literal('')),
  specialization: z
    .string()
    .max(30, 'Specjalizacja może mieć maksymalnie 30 znaków')
    .optional(),
});

export type UserEditFormData = z.infer<typeof editProfileSchema>;

export interface EditProfileFormRef {
  focusBackgroundInput: () => void;
}

type Props = {
  defaultValues: UserEditFormData;
  onSubmit: (data: UserEditFormData, onClose: () => void) => Promise<void>;
  onClose: () => void;
  serverError?: string | null;
};

const EditProfileForm = forwardRef<EditProfileFormRef, Props>(
  ({ defaultValues, onSubmit, onClose, serverError }, ref) => {
    const backgroundInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focusBackgroundInput: () => {
        backgroundInputRef.current?.focus();
      },
    }));

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<UserEditFormData>({
      defaultValues,
      resolver: zodResolver(editProfileSchema),
    });

    return (
      <Card className="border-divider bg-cBgDark-800 col-span-full w-full border p-6 pt-4 pb-5 shadow-none xl:col-span-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit((data) => onSubmit(data, onClose))();
          }}
        >
          <CardBody className="grid grid-cols-4 gap-2">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Imię i nazwisko"
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                  className="col-span-2 xl:col-span-full 2xl:col-span-2"
                  classNames={{
                    inputWrapper: 'bg-cBgDark-700 border border-divider ',
                    input: 'max-md:text-base',
                  }}
                />
              )}
            />
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Nazwa użytkownika"
                  className="col-span-2 xl:col-span-full 2xl:col-span-2"
                  isInvalid={!!errors.username}
                  errorMessage={errors.username?.message}
                  classNames={{
                    inputWrapper: 'bg-cBgDark-700 border border-divider ',
                    input: 'max-md:text-base',
                  }}
                />
              )}
            />
            <Controller
              name="avatar_url"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="URL avatara"
                  placeholder="https://example.com/avatar.jpg"
                  className="col-span-full"
                  isInvalid={!!errors.avatar_url}
                  errorMessage={errors.avatar_url?.message}
                  classNames={{
                    inputWrapper: 'bg-cBgDark-700 border border-divider',
                    input: 'max-md:text-base',
                  }}
                />
              )}
            />
            <Controller
              name="background_url"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  ref={backgroundInputRef}
                  label="URL tła"
                  placeholder="https://example.com/background.jpg"
                  className="col-span-full"
                  isInvalid={!!errors.background_url}
                  errorMessage={errors.background_url?.message}
                  classNames={{
                    inputWrapper: 'bg-cBgDark-700 border border-divider',
                    input: 'max-md:text-base',
                  }}
                />
              )}
            />
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Bio"
                  rows={4}
                  isInvalid={!!errors.bio}
                  errorMessage={errors.bio?.message}
                  className="col-span-full"
                  classNames={{
                    inputWrapper: 'bg-cBgDark-700 border border-divider',
                  }}
                />
              )}
            />
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Lokalizacja"
                  className="col-span-2 xl:col-span-full 2xl:col-span-2"
                  isInvalid={!!errors.location}
                  errorMessage={errors.location?.message}
                  classNames={{
                    inputWrapper: 'bg-cBgDark-700 border border-divider',
                    input: 'max-md:text-base',
                  }}
                />
              )}
            />
            <Controller
              name="specialization"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Specjalizacja"
                  placeholder="web / react / backend developer"
                  isInvalid={!!errors.specialization}
                  errorMessage={errors.specialization?.message}
                  className="col-span-2 xl:col-span-full 2xl:col-span-2"
                  classNames={{
                    inputWrapper: 'bg-cBgDark-700 border border-divider',
                    input: 'max-md:text-base',
                  }}
                />
              )}
            />
            <Controller
              name="website_url"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Strona WWW"
                  placeholder="https://"
                  isInvalid={!!errors.website_url}
                  className="col-span-full md:col-span-3 xl:col-span-full 2xl:col-span-3"
                  errorMessage={errors.website_url?.message}
                  classNames={{
                    inputWrapper: 'bg-cBgDark-700 border border-divider',
                  }}
                />
              )}
            />
            <Controller
              name="twitter_url"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Twitter URL"
                  placeholder="https://twitter.com/username"
                  isInvalid={!!errors.twitter_url}
                  className="col-span-full md:col-span-3 xl:col-span-full 2xl:col-span-3"
                  errorMessage={errors.twitter_url?.message}
                  classNames={{
                    inputWrapper: 'bg-cBgDark-700 border border-divider',
                    input: 'max-md:text-base',
                  }}
                />
              )}
            />
            <Controller
              name="github_url"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="GitHub URL"
                  placeholder="https://github.com/username"
                  isInvalid={!!errors.github_url}
                  className="col-span-full md:col-span-3 xl:col-span-full 2xl:col-span-3"
                  errorMessage={errors.github_url?.message}
                  classNames={{
                    inputWrapper: 'bg-cBgDark-700 border border-divider',
                    input: 'max-md:text-base',
                  }}
                />
              )}
            />
            <div className="bg-cBgDark-700 row-[6/9] hidden items-center justify-center rounded-lg p-4 text-6xl md:flex xl:hidden 2xl:flex">
              <SvgIcon icon="line-md:link" />
            </div>
            {serverError && (
              <ErrorMessage message={serverError} className="col-span-full" />
            )}
          </CardBody>
          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="solid"
              className="bg-cBgDark-700"
              onPress={onClose}
            >
              Anuluj
            </Button>
            <Button color="primary" className="bg-cCta-500" type="submit">
              Zapisz zmiany
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  }
);

EditProfileForm.displayName = 'EditProfileForm';

export default EditProfileForm;
