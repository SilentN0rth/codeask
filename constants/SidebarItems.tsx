import { Chip } from '@heroui/react';
import { SidebarItem } from '@/types/sidebar.types';
import TeamAvatar from '@/components/ui/sidebar/TeamAvatar';
import { SvgIcon } from '@/lib/utils/icons';

export const sectionItems: SidebarItem[] = [
  {
    key: 'overview',
    title: 'Przeglądaj',
    visibleIn: ['left', 'right'],
    items: [
      {
        key: 'questions',
        icon: 'solar:home-2-linear',
        href: '/questions',
        title: 'Wszystkie pytania',
      },
      {
        key: 'questions/create',
        icon: 'solar:add-square-broken',
        href: '/questions/create',
        title: 'Utwórz pytanie',
        endContent: (
          <SvgIcon
            className="text-default-400 group-data-[active-link=true]:text-cTextDark-100"
            icon="solar:add-circle-line-duotone"
            width={24}
          />
        ),
      },

      {
        key: 'tags',
        href: '/tags',
        icon: 'solar:tag-outline',
        title: 'Tagi',
      },
      {
        key: 'users',
        href: '/users',
        icon: 'solar:users-group-two-rounded-outline',
        title: 'Użytkownicy',
      },
      {
        key: 'chat',
        href: '/chat',
        icon: 'streamline-flex:user-collaborate-group',
        title: 'Czat',
      },
      {
        key: 'leaderboard',
        href: '/leaderboard',
        icon: 'material-symbols:trophy-outline',
        title: 'Tablica wyników',
        endContent: (
          <Chip size="sm" color="primary" variant="flat">
            NOWOŚĆ
          </Chip>
        ),
      },
    ],
  },
  {
    key: 'your-data',
    title: 'Moje centrum',
    visibleIn: ['left', 'right'],
    items: [
      {
        key: 'profile',
        href: '/users/{userSlug}',
        icon: 'solar:user-linear',
        title: 'Profil',
      },
      {
        key: 'saved',
        icon: 'material-symbols:bookmark-outline',
        href: '/saved',
        title: 'Zapisane pytania',
      },
      {
        key: 'followers',
        icon: 'mdi:eye',
        href: '/followers',
        title: 'Obserwujący',
      },
      {
        key: 'following',
        icon: 'mdi:eye-outline',
        href: '/following',
        title: 'Obserwowani',
      },
    ],
  },
  {
    key: 'leaders',
    title: 'Liderzy',
    className: 'hidden sm:flex',
    visibleIn: ['left'],
    items: [
      // DYNAMICZNE
    ],
  },
];
