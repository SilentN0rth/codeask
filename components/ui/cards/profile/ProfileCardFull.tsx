'use client';

import { UserInterface } from '@/types/users.types';
import { Card, CardBody, Link } from '@heroui/react';
import ProfileCardHeader from './ProfileCardHeader';
import ProfileCardMetaSection from './ProfileCardMetaSection';
import ProfileCardStats from './ProfileCardStats';
import { SvgIcon } from '@/lib/utils/icons';
import { useEffect, useState } from 'react';
import ProfileCardBadges from './ProfileCardBadges';

export default function ProfileCardFull({
  author: initialAuthor,
  className,
  skipFollowCheck = false,
}: {
  author: UserInterface | null;
  className?: string;
  skipFollowCheck?: boolean;
}) {
  const [author, setAuthor] = useState<UserInterface | null>(initialAuthor);

  useEffect(() => {
    if (initialAuthor) {
      setAuthor(initialAuthor);
    }
  }, [initialAuthor]);

  const handleFollowChanged = () => {};

  return (
    <Card
      className={`group relative z-10 overflow-visible border border-divider bg-cBgDark-800 text-white shadow-none ${className}`}
    >
      <ProfileCardHeader
        author={author}
        onFollowChanged={handleFollowChanged}
        skipFollowCheck={skipFollowCheck}
      />
      <CardBody className="flex-column gap-y-4 px-6 text-sm text-gray-300">
        <ProfileCardMetaSection author={author} />
        <ProfileCardBadges user={author} />
      </CardBody>
      <ProfileCardStats author={author} isRounded />
    </Card>
  );
}

export function ProfileMeta({
  icon,
  text,
  className,
}: {
  icon: string;
  text: string;
  className?: string;
}) {
  return (
    <span className={`block break-all text-sm ${className}`}>
      <SvgIcon icon={icon} width={18} className="mr-1.5 inline" />
      <span>{text}</span>
    </span>
  );
}

export function ProfileLink({ href }: { href: string }) {
  const displayUrl = href.replace(/^https?:\/\//, '');
  const shortened =
    displayUrl.length > 40
      ? `${displayUrl.slice(0, 37).trimEnd()}…`
      : displayUrl;

  return (
    <Link
      href={href}
      isExternal
      className="flex w-fit !min-w-fit max-w-full items-center text-sm text-cCta-500 underline underline-offset-2 hover:underline"
      title={displayUrl}
    >
      <SvgIcon icon="solar:link-bold" className="mr-2 text-medium" />
      <span className="max-w-[220px] truncate">{shortened}</span>
    </Link>
  );
}
