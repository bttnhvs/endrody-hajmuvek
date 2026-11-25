import { InquiryStatus, InquiryType } from './models';

/*
  Az ajánlatkérések típusainak és állapotainak magyar felirata.
  Egy helyen tartjuk, mert az űrlap és az admin lista is használja.
  (A backend inquiry.types.ts-ében ugyanezek az azonosítók szerepelnek.)
*/

export const INQUIRY_TYPES: { id: InquiryType; label: string; inForm: boolean }[] = [
  { id: 'szinhaz', label: 'Színházi / filmes munka', inForm: true },
  { id: 'mindennapi', label: 'Mindennapi paróka', inForm: true },
  // Csak a régi ajánlatkérések miatt van itt (admin lista), az űrlapon nem jelenik meg.
  { id: 'hajpotlas', label: 'Paróka hajvesztés miatt (régi)', inForm: false },
  { id: 'egyeb', label: 'Átalakítás, styling vagy más', inForm: true },
];

/** Az űrlapon választható típusok. */
export const FORM_INQUIRY_TYPES = INQUIRY_TYPES.filter((t) => t.inForm);

export const INQUIRY_STATUSES: { id: InquiryStatus; label: string }[] = [
  { id: 'uj', label: 'Új' },
  { id: 'folyamatban', label: 'Folyamatban' },
  { id: 'lezarva', label: 'Lezárva' },
];

/** Pl. typeLabel('hajpotlas') → 'Paróka hajvesztés miatt' */
export function typeLabel(id: InquiryType): string {
  return INQUIRY_TYPES.find((t) => t.id === id)?.label ?? id;
}
