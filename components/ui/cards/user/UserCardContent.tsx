'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useFadeIn } from '@/lib/animations/useFadeIn';
import { UserInterface } from '@/types/users.types';
import { SvgIcon } from '@/lib/utils/icons';

interface UserCardContentProps {
  user: UserInterface;
}

export const UserCardContent: React.FC<UserCardContentProps> = ({ user }) => {
  const fadeIn = useFadeIn(0, 0.3);

  const socialLinks = [
    {
      icon: 'mdi:web',
      url: user.website_url,
      label: 'Strona internetowa',
    },
    {
      icon: 'prime:twitter',
      url: user.twitter_url,
      label: 'Twitter',
    },
    {
      icon: 'simple-icons:github',
      url: user.github_url,
      label: 'GitHub',
    },
  ].filter((link) => link.url);

  return (
    <div className="flex flex-col gap-3 p-4 pt-0">
      {user.bio ? (
        <motion.p
          className="line-clamp-3 text-sm leading-relaxed text-default-500"
          {...fadeIn}
          transition={{ delay: 0.4 }}
        >
          {user.bio}
        </motion.p>
      ) : (
        <motion.p
          className="text-xs italic text-default-400"
          {...fadeIn}
          transition={{ delay: 0.4 }}
        >
          Użytkownik nie podał biografii.
        </motion.p>
      )}

      {socialLinks.length > 0 && (
        <motion.div
          className="flex flex-wrap gap-2"
          {...fadeIn}
          transition={{ delay: 0.6 }}
        >
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full bg-cBgDark-700 px-2 py-1 text-xs font-medium text-cMuted-500 transition-colors hover:bg-cBgDark-800"
            >
              <SvgIcon icon={link.icon} width={14} />
              {link.label}
            </Link>
          ))}
        </motion.div>
      )}
    </div>
  );
};
