/*
  Közös konstansok és típusok.
  Ugyanazok az értékek, mint a frontend models.ts-ében (InquiryType).
  Ha később monorepóba szervezed a két projektet, ezt a fájlt közösen is használhatják.
*/
export const INQUIRY_TYPES = ['szinhaz', 'mindennapi', 'hajpotlas', 'egyeb'] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

/** Egy ajánlatkérés útja: új → folyamatban → lezárva */
export const INQUIRY_STATUSES = ['uj', 'folyamatban', 'lezarva'] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const INQUIRY_TYPE_LABELS: Record<InquiryType, string> = {
  szinhaz: 'Színházi / filmes munka',
  mindennapi: 'Mindennapi paróka',
  hajpotlas: 'Paróka hajvesztés miatt',
  egyeb: 'Javítás, bérlés vagy más',
};
