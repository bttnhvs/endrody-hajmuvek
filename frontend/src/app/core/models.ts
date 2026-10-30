/*
  Típusok (modellek).
  Egy helyen definiáljuk, milyen alakú adatokkal dolgozik az oldal.
  Így ha később backendből (pl. egy CMS-ből) jön az adat, csak itt kell
  egyeztetni, és a TypeScript mindenhol szól, ha valami nem stimmel.
*/

/** A három vevőkör, amire az üzlet épül. */
export type Segment = 'szinhaz' | 'mindennapi' | 'hajpotlas';

export interface SegmentInfo {
  id: Segment;
  /** A fejléc fotója: egy munka azonosítója a galériából. */
  photoId: string;
  /** Mely munka-kategóriák relevánsak ennek a vevőkörnek. */
  categories: WorkCategory[];
  /** Az URL része, pl. /szinhaz */
  path: string;
  title: string;
  /** Az aloldal főcíme. */
  heroTitle: string;
  /** Egy mondat arról, kinek szól. */
  audience: string;
  summary: string;
  /** Mit kap pontosan, aki ezt választja. */
  offers: string[];
  /** Kiinduló ár Ft-ban; null = "egyedi árajánlat". */
  priceFrom: number | null;
}

/**
  A munkák kategóriája – a paróka típusa szerint, nem a vevőkör szerint
  (egy természetes hatású paróka a mindennapi és a hajpótló vevőknek is releváns).
*/
export type WorkCategory = 'karakter' | 'termeszetes' | 'arcszor' | 'muhely';

export interface GalleryItem {
  id: string;
  title: string;
  category: WorkCategory;
  caption: string;
  /** Kép a public mappából, pl. "images/munkak/bajusz.jpg" */
  image: string;
  /** A kép valódi mérete – a böngésző ebből foglal helyet, így nem ugrál az oldal betöltéskor. */
  width: number;
  height: number;
  /** Rövid leírás képernyőolvasóknak. */
  alt: string;
}

export interface ProcessStep {
  title: string;
  text: string;
  duration: string;
}

export interface Faq {
  question: string;
  answer: string;
  segments: Segment[];
}

export type InquiryType = Segment | 'egyeb';

/** Amit az ajánlatkérő űrlap elküld. */
export interface Inquiry {
  type: InquiryType;
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
  /** Rejtett spamcsapda (honeypot) – egy ember üresen hagyja. */
  website: string;
}

/** Egy ajánlatkérés feldolgozottsága (a backend INQUIRY_STATUSES-ával egyezik). */
export type InquiryStatus = 'uj' | 'folyamatban' | 'lezarva';

/** Egy elmentett ajánlatkérés, ahogy az admin végpont visszaadja. */
export interface AdminInquiry {
  id: string;
  type: InquiryType;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: InquiryStatus;
  /** ISO dátum szövegként (a JSON-ban nincs Date típus). */
  createdAt: string;
}
