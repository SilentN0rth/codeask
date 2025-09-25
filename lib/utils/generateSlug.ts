export function generateSlug(name: string) {
  const polishToLatinMap: Record<string, string> = {
    ą: 'a',
    ć: 'c',
    ę: 'e',
    ł: 'l',
    ń: 'n',
    ó: 'o',
    ś: 's',
    ź: 'z',
    ż: 'z',
  };

  const normalized = name
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (char) => polishToLatinMap[char] || char)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  return normalized;
}

export async function generateUniqueSlug(
  title: string,
  checkSlugExists: (slug: string) => Promise<boolean>
): Promise<string> {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 2;

  const exists = await checkSlugExists(slug);
  if (!exists) {
    return slug;
  }

  while (counter <= 50) {
    slug = `${baseSlug}-${counter}`;
    const slugExists = await checkSlugExists(slug);

    if (!slugExists) {
      return slug;
    }

    counter++;
  }

  throw new Error('Nie można wygenerować unikalnego slug-a');
}

export async function generateUniqueSlugForUpdate(
  title: string,
  currentQuestionId: string,
  checkSlugExistsForUpdate: (
    slug: string,
    excludeId: string
  ) => Promise<boolean>
): Promise<string> {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 2;

  const exists = await checkSlugExistsForUpdate(slug, currentQuestionId);
  if (!exists) {
    return slug;
  }

  while (counter <= 1000) {
    slug = `${baseSlug}-${counter}`;
    const slugExists = await checkSlugExistsForUpdate(slug, currentQuestionId);

    if (!slugExists) {
      return slug;
    }

    counter++;
  }

  throw new Error('Nie można wygenerować unikalnego slug-a');
}
