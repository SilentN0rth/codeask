type FormatOptions = {
    maxLength?: number;
    fallbackToInitials?: boolean;
};

export function formatUserName(fullName: string, options: FormatOptions = {}) {
    const { maxLength = 20, fallbackToInitials = true } = options;

    if (!fullName || typeof fullName !== "string") return "";

    if (fullName.length <= maxLength) return fullName;

    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
        return fullName.slice(0, maxLength - 1) + "…";
    }

    const [firstName, ...rest] = parts;
    const lastName = rest.join(" ");

    const short = `${firstName} ${lastName.charAt(0)}.`;
    if (short.length <= maxLength) return short;

    if (fallbackToInitials) {
        const initials = parts.map((p) => p.charAt(0).toUpperCase()).join(".");
        return initials.length <= maxLength ? initials : initials.slice(0, maxLength - 1) + "…";
    }

    return fullName.slice(0, maxLength - 1) + "…";
}
