'use client';

import { Avatar } from '@heroui/react';
import UniversalFilter from './UniversalLocalFilter';
import { ClassName } from '@/types/index.types';
import { UserInterface } from '@/types/users.types';

const UserFilter = ({
  className,
  value,
  onChange,
  users = [],
}: {
  value: string;
  onChange: (v: string) => void;
  users?: UserInterface[];
} & ClassName) => {
  return (
    <UniversalFilter
      items={users}
      className={className}
      value={value}
      onChange={onChange}
      ariaLabel="Użytkownik"
      isLoading={false}
      renderItem={(item) => (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 transition-transform group-hover:translate-x-[7%]">
            <Avatar
              alt={item.username || 'Użytkownik'}
              className="shrink-0"
              size="sm"
              src={item.avatar_url || ''}
              name={item.username || 'Użytkownik'}
              showFallback
              radius="full"
            />
            <div className="flex flex-col">
              <span className="text-small">
                {item.username || 'Użytkownik'}
              </span>
              {item.specialization && (
                <span className="text-default-400 text-tiny">
                  {item.specialization}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default UserFilter;
