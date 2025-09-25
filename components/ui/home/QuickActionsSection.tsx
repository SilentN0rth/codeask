'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardBody } from '@heroui/react';
import PageTitle from '../PageTitle';
import { SvgIcon } from '@/lib/utils/icons';
import Divider from '../Divider';

interface QuickActionsSectionProps {
  animation: Record<string, unknown>;
}

export function QuickActionsSection({ animation }: QuickActionsSectionProps) {
  const actions = [
    {
      title: 'Zadaj pytanie',
      description: 'Uzyskaj pomoc od społeczności',
      href: '/questions/create',
      icon: 'solar:add-square-broken',
      color: 'primary',
    },
    {
      title: 'Przeglądaj tagi',
      description: 'Znajdź popularne tematy',
      href: '/tags?sort=popularity',
      icon: 'solar:tag-outline',
      color: 'secondary',
    },
    {
      title: 'Znajdź eksperta',
      description: 'Poznaj najlepszych użytkowników',
      href: '/users?sort=mostReputation',
      icon: 'mdi:wrench-outline',
      color: 'success',
    },
  ];

  return (
    <>
      <motion.div {...animation}>
        <PageTitle
          title="Szybkie akcje"
          icon="simple-line-icons:energy"
          description="Rozpocznij swoją przygodę z platformą"
          parentClasses="mb-5"
          className="text-lg"
          as="h2"
        />

        <div className="space-y-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={action.href}>
                <Card
                  shadow="none"
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-divider bg-cBgDark-800 backdrop-blur-sm transition-all duration-300 hover:border-cCta-500/30 hover:bg-cBgDark-800/80 hover:shadow-lg hover:shadow-cCta-500/10"
                >
                  <CardBody className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-cBgDark-700 shadow-lg transition-colors group-hover:bg-cCta-500/20">
                          <SvgIcon
                            icon={action.icon}
                            width={20}
                            className="text-cCta-500 drop-shadow-sm"
                          />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-default-600 transition-colors group-hover:text-cCta-500">
                          {action.title}
                        </div>
                        <div className="text-xs text-default-500">
                          {action.description}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <SvgIcon
                          icon="solar:arrow-right-linear"
                          width={16}
                          className="text-default-400 transition-colors group-hover:text-cCta-500"
                        />
                      </div>
                    </div>

                    <div className="mt-3 h-0.5 w-0 bg-cCta-500 transition-all duration-300 group-hover:w-full" />
                  </CardBody>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
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
