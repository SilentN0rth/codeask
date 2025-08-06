export function generateSlug(name: string) {
    const polishToLatinMap: Record<string, string> = {
        ą: "a",
        ć: "c",
        ę: "e",
        ł: "l",
        ń: "n",
        ó: "o",
        ś: "s",
        ź: "z",
        ż: "z",
    };

    const normalized = name
        .toLowerCase()
        .replace(/[ąćęłńóśźż]/g, (char) => polishToLatinMap[char] || char)
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    return normalized;
}
