export function getLocalTimeString(date: Date | string): string {
    const localDate = new Date(date);
    return localDate.toLocaleString("pl-PL", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
