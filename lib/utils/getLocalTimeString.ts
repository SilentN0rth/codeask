import { formatDateLongHelper as formatDateLong } from './formatDate';

export function getLocalTimeString(date: Date | string): string {
  return formatDateLong(date);
}
