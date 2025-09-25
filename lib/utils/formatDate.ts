import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

export type DateFormatType =
  | 'relative' // "5 min temu", "2 godz. temu"
  | 'relative-short' // "5 min", "2 godz" (bez "temu")
  | 'time' // "14:30"
  | 'date-short' // "15.01.24"
  | 'date-medium' // "15 stycznia 2024"
  | 'date-long' // "15 stycznia 2024, 14:30"
  | 'activity' // "15 sty 2024, 14:30"
  | 'iso'; // ISO string

export interface FormatDateOptions {
  type: DateFormatType;
  fallback?: string;
}

/**
 * Główna funkcja formatowania dat z różnymi wariantami
 * @param date - Data do sformatowania (Date, string lub timestamp)
 * @param options - Opcje formatowania
 * @returns Sformatowana data jako string
 */
export function formatDate(
  date: Date | string | number,
  options: FormatDateOptions
): string {
  try {
    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
      return options.fallback ?? 'Nieznana data';
    }

    switch (options.type) {
      case 'relative':
        return formatRelativeTime(dateObj);

      case 'relative-short':
        return formatRelativeTimeShort(dateObj);

      case 'time':
        return dateObj.toLocaleTimeString('pl-PL', {
          hour: '2-digit',
          minute: '2-digit',
        });

      case 'date-short':
        return dateObj.toLocaleDateString('pl-PL', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        });

      case 'date-medium':
        return dateObj.toLocaleDateString('pl-PL', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

      case 'date-long':
        return dateObj.toLocaleString('pl-PL', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

      case 'activity':
        return format(dateObj, 'd MMM yyyy, HH:mm', { locale: pl });

      case 'iso':
        return dateObj.toISOString();

      default:
        return options.fallback ?? 'Nieznany format';
    }
  } catch {
    return options.fallback ?? 'Błąd formatowania';
  }
}

/**
 * Formatuje czas względny z "temu" na końcu
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return 'Teraz';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} min temu`;
  } else if (diffHours < 24) {
    return `${diffHours} godz. temu`;
  } else if (diffDays < 7) {
    return `${diffDays} dni temu`;
  } else {
    return date.toLocaleDateString('pl-PL');
  }
}

/**
 * Formatuje czas względny bez "temu" na końcu
 */
function formatRelativeTimeShort(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return 'Teraz';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} min`;
  } else if (diffHours < 24) {
    return `${diffHours} godz`;
  } else if (diffDays < 7) {
    return `${diffDays} dni`;
  } else {
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  }
}

export const formatRelativeTimeHelper = (date: Date | string | number) =>
  formatDate(date, { type: 'relative' });

export const formatRelativeTimeShortHelper = (date: Date | string | number) =>
  formatDate(date, { type: 'relative-short' });

export const formatTimeHelper = (date: Date | string | number) =>
  formatDate(date, { type: 'time' });

export const formatDateShortHelper = (date: Date | string | number) =>
  formatDate(date, { type: 'date-short' });

export const formatDateMediumHelper = (date: Date | string | number) =>
  formatDate(date, { type: 'date-medium' });

export const formatDateLongHelper = (date: Date | string | number) =>
  formatDate(date, { type: 'date-long' });

export const formatActivityDateHelper = (date: Date | string | number) =>
  formatDate(date, { type: 'activity' });

export const formatToISOHelper = (date: Date | string | number) =>
  formatDate(date, { type: 'iso' });
