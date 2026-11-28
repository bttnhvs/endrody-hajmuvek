/*
  Nyelvfüggő útvonalak. Tiszta függvények (nincs bennük Angular), így könnyű tesztelni.
  A magyar oldalak a gyökérben vannak (/szinhaz), az angolok az /en alatt (/en/theatre).
*/
export type Lang = 'hu' | 'en';

/** Magyar útvonalrész → angol útvonalrész. */
export const EN_SLUGS: Record<string, string> = {
  szinhaz: 'theatre',
  mindennapi: 'everyday',
  styling: 'styling',
  hajpotlas: 'hair-loss', // megszűnt oldal, csak az átirányítás miatt van itt
  munkaim: 'work',
  ajanlatkeres: 'contact',
  adatkezeles: 'privacy',
};

const HU_SLUGS = Object.fromEntries(Object.entries(EN_SLUGS).map(([hu, en]) => [en, hu]));

const cleanPath = (path: string) => path.split(/[?#]/)[0];

export function langOf(path: string): Lang {
  return /^\/en(\/|$)/.test(cleanPath(path)) ? 'en' : 'hu';
}

/** A kódban mindenhol a magyar útvonalat használjuk, ez alakítja át az aktuális nyelvre. */
export function localizePath(huPath: string, lang: Lang): string {
  if (lang === 'hu') return huPath;
  const slug = huPath.replace(/^\//, '');
  return slug ? `/en/${EN_SLUGS[slug] ?? slug}` : '/en';
}

/** Ugyanaz az oldal a másik nyelven. Ismeretlen oldalnál a másik nyelv főoldala. */
export function alternatePath(path: string): string {
  const clean = cleanPath(path).replace(/\/$/, '') || '/';
  if (langOf(clean) === 'en') {
    const slug = clean.replace(/^\/en\/?/, '');
    return slug && HU_SLUGS[slug] ? `/${HU_SLUGS[slug]}` : '/';
  }
  const slug = clean.replace(/^\//, '');
  return slug && EN_SLUGS[slug] ? `/en/${EN_SLUGS[slug]}` : '/en';
}
