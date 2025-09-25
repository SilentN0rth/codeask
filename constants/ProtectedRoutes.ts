// Typ dla konfiguracji chronionej strony
type ProtectedRouteConfig = {
  sidebarKey: string;
  title: string;
  description: string;
  isDynamic?: boolean;
};

// Chronione strony i ich klucze z sidebara
export const PROTECTED_ROUTES: Record<string, ProtectedRouteConfig> = {
  // Strona zapisanych pytań
  '/saved': {
    sidebarKey: 'saved',
    title: 'Zapisane pytania',
    description: 'Twoje zapisane pytania',
  },

  // Strona tworzenia pytania
  '/questions/create': {
    sidebarKey: 'questions/create',
    title: 'Utwórz pytanie',
    description: 'Dodaj nowe pytanie',
  },

  // Ustawienia konta
  '/settings': {
    sidebarKey: 'settings',
    title: 'Ustawienia',
    description: 'Ustawienia konta',
  },

  // Historia aktywności
  '/activity': {
    sidebarKey: 'activity',
    title: 'Moja aktywność',
    description: 'Historia twoich działań',
  },

  '/users/[slug]': {
    sidebarKey: 'profile',
    title: 'Mój profil',
    description: 'Zarządzaj swoim profilem',
    isDynamic: true,
  },

  '/chat': {
    sidebarKey: 'chat',
    title: 'Czat',
    description: 'Czat z innymi użytkownikami',
  },

  '/followers': {
    sidebarKey: 'followers',
    title: 'Obserwujący',
    description: 'Użytkownicy którzy Cię obserwują',
  },

  '/following': {
    sidebarKey: 'following',
    title: 'Obserwowani',
    description: 'Użytkownicy których obserwujesz',
  },
};

// Funkcja sprawdzająca czy ścieżka jest chroniona
export function isProtectedRoute(pathname: string): boolean {
  // Sprawdź dokładne dopasowanie
  if (pathname in PROTECTED_ROUTES) {
    return true;
  }

  // Sprawdź dynamiczne ścieżki
  for (const [route, config] of Object.entries(PROTECTED_ROUTES)) {
    if (config.isDynamic) {
      // Zamień [id] na regex pattern
      const pattern = route.replace(/\[.*?\]/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(pathname)) {
        return true;
      }
    }
  }

  return false;
}

// Funkcja pobierająca konfigurację dla ścieżki
export function getRouteConfig(pathname: string) {
  // Sprawdź dokładne dopasowanie
  if (pathname in PROTECTED_ROUTES) {
    return PROTECTED_ROUTES[pathname];
  }

  // Sprawdź dynamiczne ścieżki
  for (const [route, config] of Object.entries(PROTECTED_ROUTES)) {
    if (config.isDynamic) {
      const pattern = route.replace(/\[.*?\]/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(pathname)) {
        return config;
      }
    }
  }

  return null;
}

// Lista wszystkich chronionych ścieżek (dla middleware)
export const PROTECTED_PATHS = Object.keys(PROTECTED_ROUTES);

// Lista kluczy sidebara dla chronionych stron
export const PROTECTED_SIDEBAR_KEYS = Object.values(PROTECTED_ROUTES).map(
  (config) => config.sidebarKey
);
