export type BadgeType =
  | 'gold'
  | 'silver'
  | 'bronze'
  | 'first_question'
  | 'first_answer'
  | 'helpful_answer'
  | 'popular_question'
  | 'active_user'
  | 'expert'
  | 'community_companion'
  | 'community_helper';

export interface BadgeDefinition {
  id: BadgeType;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor?: string;
  category: 'achievement' | 'milestone' | 'special';
  requirements: {
    type: 'count' | 'threshold' | 'action' | 'manual';
    value?: number;
    description: string;
  };
}

// Podstawowe (istniejące):
// 🥇 Złote, Srebrne, Brązowe (za polubienia)

// Nowe Odznaki:
// 🎯 Pierwsze Pytanie - za zadanie pierwszego pytania
// 💬 Pierwsza Odpowiedź - za udzielenie pierwszej odpowiedzi
// 👍 Pomocna Odpowiedź - za odpowiedź z 5+ polubieniami
// 🔥 Popularne Pytanie - za pytanie z 10+ odpowiedziami
// ⏰ Aktywny Użytkownik - za aktywnośc na conajmniej godzinę przez 3 dni
// 🎓 Ekspert - uzytkownik z 100+ odpowiedziami, 50+ pytaniami, 50+ polubieniami na odpowiedziach
// ❤️ Towarzysz Społeczności - za posiadanie minimum 50+ obserwujących i 50+ obserwowanych
// 🤝 Pomocnik Społeczności - za 100+ pomocnych działań (odpowiedzi, pytania, komentarze, itp.)

export const BADGE_DEFINITIONS: Record<BadgeType, BadgeDefinition> = {
  // Podstawowe odznaki (istniejące)
  gold: {
    id: 'gold',
    name: 'Złota Odznaka',
    description: 'Za wysoką reputację w społeczności',
    icon: '🥇',
    color: 'text-cStatusYellow-400',
    bgColor: 'rgba(251, 191, 36, 0.2)', // yellow-400 with 20% opacity
    category: 'achievement',
    requirements: {
      type: 'threshold',
      value: 100,
      description: 'Osiągnij 100+ reputacji',
    },
  },
  silver: {
    id: 'silver',
    name: 'Srebrna Odznaka',
    description: 'Za dobrą reputację w społeczności',
    icon: '🥈',
    color: 'text-cMuted-300',
    bgColor: 'rgba(156, 163, 175, 0.2)', // gray-400 with 20% opacity
    category: 'achievement',
    requirements: {
      type: 'threshold',
      value: 50,
      description: 'Osiągnij 50+ reputacji',
    },
  },
  bronze: {
    id: 'bronze',
    name: 'Brązowa Odznaka',
    description: 'Za podstawową reputację w społeczności',
    icon: '🥉',
    color: 'text-orange-500',
    bgColor: 'rgba(249, 115, 22, 0.2)', // orange-500 with 20% opacity
    category: 'achievement',
    requirements: {
      type: 'threshold',
      value: 10,
      description: 'Osiągnij 10+ reputacji',
    },
  },

  // Odznaki za pierwsze kroki
  first_question: {
    id: 'first_question',
    name: 'Pierwsze Pytanie',
    description: 'Zadałeś swoje pierwsze pytanie',
    icon: '🎯',
    color: 'text-blue-400',
    bgColor: 'rgba(96, 165, 250, 0.2)', // blue-400 with 20% opacity
    category: 'milestone',
    requirements: {
      type: 'action',
      description: 'Zadaj pierwsze pytanie',
    },
  },
  first_answer: {
    id: 'first_answer',
    name: 'Pierwsza Odpowiedź',
    description: 'Udzieliłeś swojej pierwszej odpowiedzi',
    icon: '💬',
    color: 'text-green-400',
    bgColor: 'rgba(74, 222, 128, 0.2)', // green-400 with 20% opacity
    category: 'milestone',
    requirements: {
      type: 'action',
      description: 'Udziel pierwszej odpowiedzi',
    },
  },

  // Odznaki za jakość
  helpful_answer: {
    id: 'helpful_answer',
    name: 'Pomocna Odpowiedź',
    description: 'Twoja odpowiedź została oznaczona jako pomocna',
    icon: '👍',
    color: 'text-green-500',
    bgColor: 'rgba(34, 197, 94, 0.2)', // green-500 with 20% opacity
    category: 'achievement',
    requirements: {
      type: 'threshold',
      value: 5,
      description: 'Otrzymaj 5+ polubień na jednej odpowiedzi',
    },
  },
  popular_question: {
    id: 'popular_question',
    name: 'Popularne Pytanie',
    description: 'Twoje pytanie przyciągnęło dużo uwagi',
    icon: '🔥',
    color: 'text-red-500',
    bgColor: 'rgba(239, 68, 68, 0.2)', // red-500 with 20% opacity
    category: 'achievement',
    requirements: {
      type: 'threshold',
      value: 10,
      description: 'Pytanie z 10+ odpowiedziami',
    },
  },

  // Odznaki za aktywność
  active_user: {
    id: 'active_user',
    name: 'Aktywny Użytkownik',
    description: 'Regularnie uczestniczysz w społeczności',
    icon: '⏰',
    color: 'text-purple-400',
    bgColor: 'rgba(168, 85, 247, 0.2)', // purple-400 with 20% opacity
    category: 'achievement',
    requirements: {
      type: 'threshold',
      value: 14, // 14 dni
      description: 'Aktywność przez 14 dni',
    },
  },

  // Odznaki specjalne
  expert: {
    id: 'expert',
    name: 'Ekspert',
    description: 'Użytkownik z 100+ odpowiedziami',
    icon: '🎓',
    color: 'text-yellow-500',
    bgColor: 'rgba(234, 179, 8, 0.2)', // yellow-500 with 20% opacity
    category: 'special',
    requirements: {
      type: 'threshold',
      value: 100,
      description: '100+ odpowiedzi',
    },
  },
  community_companion: {
    id: 'community_companion',
    name: 'Towarzysz Społeczności',
    description: 'Za posiadanie minimum 20+ obserwujących i 20+ obserwowanych',
    icon: '❤️',
    color: 'text-pink-500',
    bgColor: 'rgba(236, 72, 153, 0.2)', // pink-500 with 20% opacity
    category: 'special',
    requirements: {
      type: 'threshold',
      value: 20,
      description: '20+ obserwujących i 20+ obserwowanych',
    },
  },
  community_helper: {
    id: 'community_helper',
    name: 'Pomocnik Społeczności',
    description: 'Za 100+ pomocnych działań (odpowiedzi, pytania, polubienia)',
    icon: '🤝',
    color: 'text-teal-500',
    bgColor: 'rgba(20, 184, 166, 0.2)', // teal-500 with 20% opacity
    category: 'special',
    requirements: {
      type: 'threshold',
      value: 100,
      description: '100+ pomocnych działań (odpowiedzi, pytania, polubienia)',
    },
  },
};

export interface BadgeAward {
  userId: string;
  badgeType: BadgeType;
  awardedAt: string;
  awardedBy?: string; // null dla automatycznych
  reason?: string;
}
