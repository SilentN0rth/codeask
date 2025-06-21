import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";

export function getRelativeTimeFromNow(date: Date | string): string {
    return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: pl,
    });
}
