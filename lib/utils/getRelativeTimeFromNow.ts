import { formatRelativeTimeHelper as formatRelativeTime } from './formatDate';

export function getRelativeTimeFromNow(date: Date | string): string {
  return formatRelativeTime(date);
}
