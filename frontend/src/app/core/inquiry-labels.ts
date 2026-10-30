import { InquiryStatus, InquiryType } from './models';

/*
  Az ajánlatkérések típusainak és állapotainak magyar felirata.
  Egy helyen tartjuk, mert az űrlap és az admin lista is használja.
  (A backend inquiry.types.ts-ében ugyanezek az azonosítók szerepelnek.)
*/

export const INQUIRY_TYPES: { id: InquiryType; label: string }[] = [
  { id: 'szinhaz', label: 'Színházi / filmes munka' },
  { id: 'mindennapi', label: 'Mindennapi paróka' },
  { id: 'hajpotlas', label: 'Paróka hajvesztés miatt' },
  { id: 'egyeb', label: 'Javítás, bérlés vagy más' },
];

export const INQUIRY_STATUSES: { id: InquiryStatus; label: string }[] = [
  { id: 'uj', label: 'Új' },
  { id: 'folyamatban', label: 'Folyamatban' },
  { id: 'lezarva', label: 'Lezárva' },
];

/** Pl. typeLabel('hajpotlas') → 'Paróka hajvesztés miatt' */
export function typeLabel(id: InquiryType): string {
  return INQUIRY_TYPES.find((t) => t.id === id)?.label ?? id;
}
