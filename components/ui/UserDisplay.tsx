'use client';

import React from 'react';
import { Avatar, Badge } from '@heroui/react';
import { UserInterface } from '@/types/users.types';
import { DirectChat } from '@/types/chat.types';
import Link from 'next/link';

type UserDisplayUser = UserInterface | DirectChat['other_user'] | null;

interface UserDisplayProps {
  user: UserDisplayUser;
  variant?: 'card' | 'profile' | 'compact' | 'withNick';
  size?: 'sm' | 'md' | 'lg';
  linkToProfile?: boolean;
  isCompact?: boolean;
  withIndicator?: boolean;
}

export function UserDisplay({
  user,
  variant = 'card',
  size = 'md',
  linkToProfile = true,
  withIndicator = true,
  isCompact = false,
}: UserDisplayProps) {
  if (!user) {
    if (isCompact) {
      return <Avatar size={size} radius="full" showFallback />;
    }
    return (
      <div className="flex items-center gap-3">
        <Avatar size={size} radius="full" showFallback />
        <span className="text-sm font-semibold text-default-600">
          Użytkownik
        </span>
      </div>
    );
  }

  const avatarUrl = user.avatar_url;
  const displayName = user.name || user.username;
  const username = user.username || '';
  const specialization = 'specialization' in user ? user.specialization : '';
  const isOnline = user.is_online;

  const hasSpecialization = specialization?.trim();
  const hasUsername = username.trim();

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'md':
        return 'text-sm';
      case 'lg':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  const getSubtextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'md':
        return 'text-xs';
      case 'lg':
        return 'text-sm';
      default:
        return 'text-xs';
    }
  };

  const renderAvatar = () => {
    const avatar = (
      <Avatar
        size={size}
        src={avatarUrl}
        name={displayName}
        isBordered
        radius="full"
        showFallback
        className="cursor-pointer"
        alt={`Avatar użytkownika ${displayName}`}
      />
    );

    if (isOnline && withIndicator) {
      return (
        <Badge
          color="success"
          content=""
          placement="bottom-right"
          shape="circle"
        >
          {avatar}
        </Badge>
      );
    }

    return avatar;
  };

  const renderContent = () => {
    if (isCompact) {
      return renderAvatar();
    }

    switch (variant) {
      case 'compact':
        return (
          <div className="flex items-center gap-3">
            {renderAvatar()}
            <span className={`font-semibold text-default-600 ${getTextSize()}`}>
              {displayName}
            </span>
          </div>
        );

      case 'withNick':
        return (
          <div className="flex items-center gap-3">
            {renderAvatar()}
            <div className="flex flex-col">
              <span
                className={`font-semibold text-default-600 ${getTextSize()}`}
              >
                {displayName}
              </span>
              {hasUsername && (
                <span className={`text-default-500 ${getSubtextSize()}`}>
                  @{username}
                </span>
              )}
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="flex items-center gap-3">
            {renderAvatar()}
            <div className="flex flex-col">
              <span
                className={`font-semibold text-default-600 ${getTextSize()}`}
              >
                {displayName}
              </span>
              <span className={`text-default-500 ${getSubtextSize()}`}>
                {hasSpecialization ? specialization : 'Brak specjalizacji'}
              </span>
            </div>
          </div>
        );

      case 'profile':
      default:
        return (
          <div className="flex items-center gap-3">
            {renderAvatar()}
            <div className="flex flex-col">
              <span
                className={`font-semibold text-default-600 ${getTextSize()}`}
              >
                {displayName}
              </span>
              <div className={`text-default-500 ${getSubtextSize()}`}>
                {hasUsername && `@${username}`}
                {hasUsername && hasSpecialization && ' | '}
                {hasSpecialization && specialization}
              </div>
            </div>
          </div>
        );
    }
  };

  if (linkToProfile && 'profile_slug' in user && user.profile_slug) {
    if (isCompact) {
      return (
        <Link
          href={`/users/${user.profile_slug}`}
          aria-label={`Przejdź do profilu użytkownika ${displayName}`}
          title={`Profil użytkownika ${displayName}`}
        >
          {renderContent()}
        </Link>
      );
    }

    return (
      <Link
        href={`/users/${user.profile_slug}`}
        className="block"
        aria-label={`Przejdź do profilu użytkownika ${displayName}`}
        title={`Profil użytkownika ${displayName}`}
      >
        {renderContent()}
      </Link>
    );
  }

  return renderContent();
}

export default UserDisplay;
