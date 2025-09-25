type FormatOptions = {
  maxLength?: number;
  fallbackToInitials?: boolean;
};

export function formatUserName(fullName: string, options: FormatOptions = {}) {
  const { maxLength = 20, fallbackToInitials = true } = options;

  if (!fullName || typeof fullName !== 'string') return '';

  if (fullName.length <= maxLength) return fullName;

  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return `${fullName.slice(0, maxLength - 1)}…`;
  }

  const [firstName, ...rest] = parts;
  const lastName = rest.join(' ');

  const short = `${firstName} ${lastName.charAt(0)}.`;
  if (short.length <= maxLength) return short;

  if (fallbackToInitials) {
    const initials = parts.map((p) => p.charAt(0).toUpperCase()).join('.');
    return initials.length <= maxLength
      ? initials
      : `${initials.slice(0, maxLength - 1)}…`;
  }

  return `${fullName.slice(0, maxLength - 1)}…`;
}

/**
 * Formatuje nazwę użytkownika z fallback do username
 * @param user - obiekt użytkownika z polami name i username
 * @param options - opcje formatowania
 * @returns sformatowana nazwa użytkownika
 */
export function formatUserDisplayName(
  user: { name?: string; username?: string } | null,
  options: FormatOptions = {}
): string {
  if (!user) return 'Użytkownik';

  // Jeśli mamy pełne imię i nazwisko, użyj go
  if (user.name?.trim()) {
    return formatUserName(user.name, options);
  }

  // Jeśli nie ma imienia, użyj username
  if (user.username?.trim()) {
    return user.username;
  }

  // Ostatni fallback
  return 'Użytkownik';
}

/**
 * Formatuje układ użytkownika w zależności od kontekstu
 * @param user - obiekt użytkownika
 * @param context - kontekst wyświetlania
 * @returns obiekt z sformatowanymi danymi
 */
export function formatUserLayout(
  user: { name?: string; username?: string; specialization?: string } | null,
  context: 'card' | 'profile' | 'compact' = 'card'
): {
  displayName: string;
  subtitle: string;
  showNick: boolean;
} {
  if (!user) {
    return {
      displayName: 'Użytkownik',
      subtitle: '',
      showNick: false,
    };
  }

  const displayName = formatUserDisplayName(user);
  const hasSpecialization = user.specialization?.trim();
  const hasUsername = user.username?.trim();

  switch (context) {
    case 'profile':
      // Profil: imię + nick z małpą + profesja
      return {
        displayName,
        subtitle: hasUsername
          ? `@${user.username ?? ''}${hasSpecialization ? ` | ${user.specialization ?? ''}` : ''}`
          : hasSpecialization
            ? (user.specialization ?? '')
            : '',
        showNick: true,
      };

    case 'card':
      // Karty: imię + profesja (bez nicka)
      return {
        displayName,
        subtitle: hasSpecialization ? (user.specialization ?? '') : '',
        showNick: false,
      };

    case 'compact':
      // Kompaktowy: tylko imię
      return {
        displayName,
        subtitle: '',
        showNick: false,
      };

    default:
      return {
        displayName,
        subtitle: hasSpecialization ? (user.specialization ?? '') : '',
        showNick: false,
      };
  }
}
