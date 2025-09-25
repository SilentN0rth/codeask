'use client';

import { Card, CardBody } from '@heroui/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SvgIcon } from '@/lib/utils/icons';
import { UserInterface } from '@/types/users.types';
import PageTitle from '../PageTitle';
import SeeAllButton from '../SeeAllButton';
interface UsersSectionProps {
  users: UserInterface[];
  animation: Record<string, unknown>;
}

export const UsersSection = ({ users, animation }: UsersSectionProps) => {
  if (users.length === 0) return null;

  return (
    <>
      <motion.div {...animation}>
        <PageTitle
          title="Liderzy społeczności"
          icon="material-symbols:trophy-outline"
          description="Najaktywniejsze osoby w społeczności"
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
                      <div className="flex-shrink-0">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-cBgDark-700 shadow-lg transition-colors group-hover:bg-cCta-500/20">
                          <SvgIcon
                            icon="solar:user-linear"
                            width={20}
                            className="text-cCta-500 drop-shadow-sm"
                          />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-default-600 transition-colors group-hover:text-cCta-500">
                          {user.name}
                        </div>
                        <div className="text-xs text-default-500">
                          {user.reputation} reputacji
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-cCta-500/20 shadow-lg">
                          <span className="text-sm font-bold text-cCta-500">
                            #{index + 1}
                          </span>
                        </div>
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
          href="/leaderboard"
          className="mt-4 text-cCta-500 hover:bg-cCta-500/10"
        >
          Zobacz tablice wyników
        </SeeAllButton>
      </motion.div>
    </>
  );
};
