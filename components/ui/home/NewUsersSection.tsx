'use client';

import { UserInterface } from '@/types/users.types';
import { motion } from 'framer-motion';
import { Card, CardBody } from '@heroui/react';
import Link from 'next/link';
import Divider from '../Divider';
import PageTitle from '../PageTitle';
import { SvgIcon } from '@/lib/utils/icons';
import { formatUserDisplayName } from '@/lib/utils/formatUserName';
import SeeAllButton from '../SeeAllButton';

interface NewUsersSectionProps {
  users: UserInterface[];
  animation: Record<string, unknown>;
}

export function NewUsersSection({ users, animation }: NewUsersSectionProps) {
  if (users.length === 0) return null;

  return (
    <>
      <motion.div {...animation}>
        <PageTitle
          title="Nowi użytkownicy"
          icon="solar:users-group-two-rounded-outline"
          description="Nowi użytkownicy, którzy już pomogli!"
          parentClasses="mb-5"
          className="text-lg"
          as="h2"
        />
        <div className="space-y-3">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/users/${user.profile_slug}`}>
                <Card
                  shadow="none"
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-divider bg-cBgDark-800 backdrop-blur-sm transition-all duration-300 hover:border-cCta-500/30 hover:bg-cBgDark-800/80 hover:shadow-lg hover:shadow-cCta-500/10"
                >
                  <CardBody className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 flex-shrink-0 items-center justify-center place-self-start rounded-lg bg-cBgDark-700 shadow-lg transition-colors group-hover:bg-cCta-500/20">
                        <SvgIcon
                          icon="solar:user-linear"
                          width={20}
                          className="text-cCta-500 drop-shadow-sm"
                        />
                      </div>
                      <div className="flex w-full flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <p className="truncate text-sm font-semibold text-default-600 transition-colors group-hover:text-cCta-500">
                            {formatUserDisplayName(user)}
                          </p>
                          <p className="truncate text-xs text-default-500">
                            @{user.username}
                          </p>
                        </div>
                        {(user.questions_count > 0 ||
                          user.answers_count > 0) && (
                          <span className="rounded-full bg-cCta-500/20 px-2 py-0.5 text-xs text-cCta-500">
                            {user.questions_count > 0 &&
                              `${user.questions_count} pytań`}
                            {user.questions_count > 0 &&
                              user.answers_count > 0 &&
                              ', '}
                            {user.answers_count > 0 &&
                              `${user.answers_count} odpowiedzi`}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 h-0.5 w-0 bg-cCta-500 transition-all duration-300 group-hover:w-full" />
                  </CardBody>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        <SeeAllButton
          href="/users"
          className="mt-4 text-cCta-500 hover:bg-cCta-500/10"
        >
          Zobacz wszystkich użytkowników
        </SeeAllButton>
      </motion.div>
      <Divider
        text="</>"
        orientation="horizontal"
        position="center"
        bgColor="bg-cBgDark-900"
      />
    </>
  );
}
