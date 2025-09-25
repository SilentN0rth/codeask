'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, ButtonGroup, Form } from '@heroui/react';
import Divider from '@/components/ui/Divider';
import {
  registerSchema,
  loginSchema,
  type RegisterForm,
  type LoginForm,
} from '@/lib/schemas/login-register.schema';
import PasswordInput from '@/components/layout/Login/PasswordInput';
import { SvgIcon } from '@/lib/utils/icons';
import PageTitle from '@/components/ui/PageTitle';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn, signUp } from '@/services/server/auth';

interface AuthFormProps {
  defaultMode: 'login' | 'register';
}

const SocialLoginButtons = () => (
  <motion.div
    className="mt-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
  >
    <Divider text="(PRACE TECHNICZNE TRWAJĄ)" bgColor="bg-cBgDark-900" />
    <ButtonGroup isDisabled radius="sm" className="w-full">
      <Button
        // onPress={() => signInWithProvider('google')}
        color="default"
        variant="bordered"
        className="flex-1 border-1"
        startContent={<SvgIcon icon="logos:google-icon" className="size-5" />}
      >
        Google
      </Button>

      <Button
        // onPress={() => signInWithProvider('github')}
        color="default"
        className="flex-1 border-1 border-l-0"
        variant="bordered"
        startContent={<SvgIcon icon="mdi:github" className="size-5" />}
      >
        GitHub
      </Button>

      <Button
        // onPress={() => signInWithProvider('facebook')}
        color="default"
        className="flex-1 border-1 border-l-0"
        variant="bordered"
        startContent={<SvgIcon icon="logos:facebook" className="size-5" />}
      >
        Facebook
      </Button>
    </ButtonGroup>
  </motion.div>
);

export default function AuthForm({ defaultMode }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [registerErrorMsg, setRegisterErrorMsg] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [loadingRegisterAction, setLoadingRegisterAction] = useState(false);
  const [activeCard, setActiveCard] = useState<'login' | 'register'>(
    defaultMode
  );

  // Login form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Register form
  const {
    control: registerControl,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegister,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setErrorMsg(null);
    setLoadingAction(true);

    try {
      const { error } = await signIn(data.email, data.password);
      if (error) throw error;
      reset();
    } catch (err: unknown) {
      setErrorMsg((err as Error).message ?? 'Nieznany błąd logowania.');
    } finally {
      setLoadingAction(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterForm) => {
    setRegisterErrorMsg(null);
    setLoadingRegisterAction(true);

    try {
      const { error } = await signUp(data.email, data.password);
      if (error) throw error;
      resetRegister();
    } catch (err: unknown) {
      setRegisterErrorMsg(
        (err as Error).message ?? 'Nieznany błąd rejestracji.'
      );
    } finally {
      setLoadingRegisterAction(false);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <motion.div
        className="mb-8 flex items-center gap-2 rounded-full border border-divider bg-cBgDark-800 p-1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          onClick={() => setActiveCard('login')}
          className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
            activeCard === 'login'
              ? 'bg-cCta-500 text-white shadow-lg'
              : 'text-default-500 hover:text-default-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Logowanie
        </motion.button>
        <motion.button
          onClick={() => setActiveCard('register')}
          className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
            activeCard === 'register'
              ? 'bg-cCta-500 text-white shadow-lg'
              : 'text-default-500 hover:text-default-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Rejestracja
        </motion.button>
      </motion.div>

      <div className="relative w-full max-w-[460px]">
        <AnimatePresence mode="wait">
          {activeCard === 'login' ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
                scale: { duration: 0.3 },
              }}
              className="w-full"
            >
              <PageTitle
                parentClasses="mb-6"
                title="Logowanie"
                icon="solar:login-2-linear"
                description="Zaloguj się do swojego konta"
              />
              <Form
                onSubmit={handleSubmit(onSubmit)}
                className="flex w-full flex-col gap-4"
              >
                <div className="grid w-full grid-cols-[1fr,1fr,55px] gap-3">
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        className="col-span-3"
                        label="Twój e-mail"
                        classNames={{
                          input: 'text-base',
                          inputWrapper:
                            'bg-cBgDark-700 group-hover:bg-cBgDark-700/50 group-data-[focus=true]:bg-cBgDark-700/50 border border-divider',
                        }}
                        isInvalid={!!errors.email}
                        errorMessage={errors.email?.message as string}
                      />
                    )}
                  />

                  <PasswordInput
                    className="col-span-2"
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

                {errorMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-1 font-light text-danger text-tiny"
                  >
                    {errorMsg}
                  </motion.p>
                )}
              </Form>

              <SocialLoginButtons />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
                scale: { duration: 0.3 },
              }}
              className="w-full"
            >
              <PageTitle
                as="h2"
                parentClasses="mb-6"
                title="Rejestracja"
                icon="solar:user-plus-linear"
                description="Utwórz nowe konto"
              />
              <Form
                onSubmit={handleRegisterSubmit(onRegisterSubmit)}
                className="flex w-full flex-col gap-4"
              >
                <div className="grid w-full grid-cols-[1fr,55px] gap-3">
                  <Controller
                    name="email"
                    control={registerControl}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        label="Twój e-mail"
                        classNames={{
                          base: 'col-span-full text-base',
                          inputWrapper:
                            'bg-cBgDark-700 group-hover:bg-cBgDark-700/50 group-data-[focus=true]:bg-cBgDark-700/50 border border-divider',
                        }}
                        isInvalid={!!registerErrors.email}
                        errorMessage={registerErrors.email?.message as string}
                      />
                    )}
                  />

                  <PasswordInput
                    control={registerControl}
                    name="password"
                    className="col-span-full"
                    label="Twoje hasło"
                    error={registerErrors.password?.message as string}
                    showPassword={showRegisterPassword}
                    setShowPassword={setShowRegisterPassword}
                  />
                  <PasswordInput
                    control={registerControl}
                    name="confirmPassword"
                    label="Potwierdź hasło"
                    error={registerErrors.confirmPassword?.message as string}
                    showPassword={showRegisterPassword}
                    setShowPassword={setShowRegisterPassword}
                  />
                  <Button
                    type="submit"
                    color="primary"
                    isLoading={loadingRegisterAction}
                    isDisabled={
                      !!registerErrors.email ||
                      !!registerErrors.password ||
                      !!registerErrors.confirmPassword
                    }
                    className="h-14 w-full !min-w-fit"
                    endContent={
                      !loadingRegisterAction && (
                        <SvgIcon icon="material-symbols:login" width={20} />
                      )
                    }
                  />
                </div>

                {registerErrorMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-1 font-light text-danger text-tiny"
                  >
                    {registerErrorMsg}
                  </motion.p>
                )}
              </Form>

              <SocialLoginButtons />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
