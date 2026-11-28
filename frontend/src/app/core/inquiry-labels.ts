import { InquiryType } from './models';

/*
  Az ajánlatkérések típusainak magyar felirata.
  Az űrlap a nyelvfüggő feliratokat az ui.ts-ből veszi; ez a magyar változat kerül
  a Netlifyba küldött adatba, hogy a beérkezett üzenetekben mindig magyarul látszódjon.
*/
export const INQUIRY_TYPES: { id: InquiryType; label: string }[] = [
  { id: 'szinhaz', label: 'Színházi / filmes munka' },
  { id: 'mindennapi', label: 'Mindennapi paróka' },
  { id: 'egyeb', label: 'Átalakítás, styling vagy más' },
];

/** Pl. typeLabel('szinhaz') → 'Színházi / filmes munka' */
export function typeLabel(id: InquiryType): string {
  return INQUIRY_TYPES.find((t) => t.id === id)?.label ?? id;
}
