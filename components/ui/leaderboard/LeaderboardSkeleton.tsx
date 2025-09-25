'use client';

import { SvgIcon } from '@/lib/utils/icons';
import { Skeleton } from '@heroui/react';

export const LeaderboardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-cBgDark-800 bg-cBgDark-700 shadow-lg">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between text-cTextDark-100">
          <div className="flex items-center space-x-3">
            <SvgIcon icon="mdi:chart-bar" className="size-5" />
            <h4 className="text-base font-medium">Podsumowanie aktywności</h4>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <SvgIcon icon="mdi:account-group" className="size-4" />
              <span>... użytkowników</span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-cBgDark-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-cMuted-500">
                Pozycja
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-cMuted-500">
                Użytkownik
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-cMuted-500">
                Reputacja
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-cMuted-500">
                Odpowiedzi
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-cMuted-500">
                Pytania
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-cMuted-500">
                Odznaki
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cBgDark-800 bg-cBgDark-700">
            {Array.from({ length: 10 }).map(() => (
              <tr
                key={`skeleton-row-${Math.random()}-${Date.now()}`}
                className="transition-colors duration-200 hover:bg-cBgDark-800/50"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <Skeleton className="size-8 rounded-full" />
                  </div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="size-10 flex-shrink-0">
                      <Skeleton className="size-10 rounded-full" />
                    </div>
                    <div className="ml-4">
                      <Skeleton className="mb-1 h-4 w-24 rounded" />
                      <Skeleton className="h-3 w-20 rounded" />
                    </div>
                  </div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <Skeleton className="h-4 w-16 rounded" />
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <Skeleton className="mr-2 size-4 rounded" />
                    <Skeleton className="h-4 w-8 rounded" />
                  </div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <Skeleton className="mr-2 size-4 rounded" />
                    <Skeleton className="h-4 w-8 rounded" />
                  </div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex flex-wrap items-center gap-1">
                    <Skeleton className="size-5 rounded-full" />
                    <Skeleton className="size-5 rounded-full" />
                    <Skeleton className="size-5 rounded-full" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
