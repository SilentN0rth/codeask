'use client';

import Divider from '@/components/ui/Divider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Modal,
  Input,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  ButtonGroup,
  ModalFooter,
  addToast,
} from '@heroui/react';
import { AuthModalInterface } from '@/types/modals.types';
import PasswordInput from './PasswordInput';
import { SvgIcon } from '@/lib/utils/icons';

export default function AuthModal({
  isOpen,
  onClose,
  title,
  description,
  toastTitle,
  toastDescription,
  schema,
  defaultValues,
  onSubmit,
  user,
  fields,
}: AuthModalInterface) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as Record<string, unknown>,
  });

  if (user) return null;

  const submitHandler = async (data: unknown) => {
    setError(null);
    setErrorStatus(false);
    setLoadingAction(true);

    try {
      await onSubmit(data);

      setError(null);
      setErrorStatus(false);

      onClose();
      reset();

      addToast({
        title: toastTitle,
        description: toastDescription,
        icon: <SvgIcon icon="solar:login-2-linear" />,
        color: 'success',
      });
    } catch (err: unknown) {
      const error = err as Error;
      if (error.message === 'Invalid login credentials') {
        setError('Niepoprawny email lub hasło. Spróbuj ponownie.');
      } else if (error.message === 'User already exists') {
        setError('Użytkownik o takim emailu już istnieje.');
      } else {
        setError(`Wystąpił błąd: ${error.message}`);
      }
      setErrorStatus(true);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setShowPassword(false);
        setErrorStatus(false);
        setError(null);
      }}
      backdrop="blur"
      isDismissable
      isKeyboardDismissDisabled={false}
      className="text-foreground dark"
    >
      <ModalContent className="bg-cBgDark-800">
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 pb-0 pt-4">
              {title}
            </ModalHeader>
            <ModalBody className="w-full space-y-4">
              <p className="text-sm text-default-500">{description}</p>
              <form
                onSubmit={handleSubmit(submitHandler)}
                className="flex flex-col gap-3"
              >
                {fields.includes('email') && (
                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: 'Email jest wymagany' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        label="Twój e-mail"
                        classNames={{
                          input: 'text-base',
                          inputWrapper:
                            'bg-cBgDark-700 group-hover:bg-cBgDark-700/50 group-data-[focus=true]:bg-cBgDark-700/50 border border-divider',
                        }}
                        isInvalid={!!errors.email || errorStatus}
                        errorMessage={errors.email?.message as string}
                      />
                    )}
                  />
                )}

                {fields.includes('confirmPassword') ? (
                  <div className="grid grid-cols-[1fr,55px] gap-3">
                    <PasswordInput
                      control={control}
                      name="password"
                      className="col-span-full"
                      label="Twoje hasło"
                      error={errors.password?.message as string}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />
                    <PasswordInput
                      control={control}
                      name="confirmPassword"
                      label="Potwierdź hasło"
                      error={errors.confirmPassword?.message as string}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />
                    <Button
                      type="submit"
                      color="primary"
                      isLoading={loadingAction}
                      isDisabled={
                        !!errors.email ||
                        !!errors.password ||
                        !!errors.confirmPassword
                      }
                      className="h-14 w-full !min-w-fit"
                      endContent={
                        !loadingAction && (
                          <SvgIcon icon="material-symbols:login" width={20} />
                        )
                      }
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-[1fr,auto] gap-3">
                    <PasswordInput
                      control={control}
                      name="password"
                      label="Twoje hasło"
                      error={errors.password?.message as string}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />
                    <Button
                      type="submit"
                      color="primary"
                      isIconOnly
                      isLoading={loadingAction}
                      isDisabled={!!errors.email || !!errors.password}
                      className="size-14"
                      endContent={
                        !loadingAction && (
                          <SvgIcon icon="material-symbols:login" width={20} />
                        )
                      }
                    />
                  </div>
                )}

                {error && (
                  <p className="p-1 font-light text-danger text-tiny">
                    {error}
                  </p>
                )}
              </form>

              <Divider className="my-4" text="(PRACE TECHNICZNE TRWAJĄ)" />
            </ModalBody>
            <ModalFooter className="justify-center">
              <SocialButtons />
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function SocialButtons() {
  return (
    <ButtonGroup radius="sm" fullWidth isDisabled>
      <Button
        // onPress={() => signInWithProvider('google')}
        color="default"
        variant="bordered"
        className="border-1"
        startContent={<SvgIcon icon="logos:google-icon" className="size-5" />}
      />

      <Button
        // onPress={() => signInWithProvider('github')}
        color="default"
        className="border-1 border-l-0"
        variant="bordered"
        startContent={<SvgIcon icon="mdi:github" className="size-5" />}
      />

      <Button
        // onPress={() => signInWithProvider('facebook')}
        color="default"
        className="border-1 border-l-0"
        variant="bordered"
        startContent={<SvgIcon icon="logos:facebook" className="size-5" />}
      />
    </ButtonGroup>
  );
}
