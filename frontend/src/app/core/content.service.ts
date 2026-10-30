import { Injectable, signal } from '@angular/core';
import { CATEGORY_LABELS, FAQS, GALLERY, PROCESS, SEGMENTS } from './content';
import { Faq, GalleryItem, Segment, SegmentInfo, WorkCategory } from './models';

/*
  ContentService – a komponensek innen kérik az adatot.

  Miért kell, ha az adat egy sima .ts fájlban van?
  Mert így a komponensek nem tudják (és nem is kell tudniuk), honnan jön
  az adat. Ha később HTTP-n keresztül töltöd (pl. egy headless CMS-ből),
  csak ezt az osztályt írod át.

  A `signal()` egy reaktív érték: ha egyszer betöltéskor frissítjük,
  minden sablon, ami olvassa, automatikusan újrarajzolódik.
*/
@Injectable({ providedIn: 'root' })
export class ContentService {
  readonly segments = signal<SegmentInfo[]>(SEGMENTS).asReadonly();
  readonly process = signal(PROCESS).asReadonly();
  readonly gallery = signal(GALLERY).asReadonly();
  readonly faqs = signal(FAQS).asReadonly();
  readonly categoryLabels = CATEGORY_LABELS;

  segment(id: Segment): SegmentInfo {
    // A `!` azt mondja a TS-nek: biztosan van ilyen elem (a típus garantálja).
    return this.segments().find((s) => s.id === id)!;
  }

  /** Egy vevőkörnek releváns munkák (pl. színháznak: karakterparókák + szakáll). */
  worksFor(id: Segment): GalleryItem[] {
    const categories = this.segment(id).categories;
    return this.gallery().filter((g) => categories.includes(g.category));
  }

  work(id: string): GalleryItem | undefined {
    return this.gallery().find((g) => g.id === id);
  }

  worksIn(category: WorkCategory): GalleryItem[] {
    return this.gallery().filter((g) => g.category === category);
  }

  faqsFor(id: Segment): Faq[] {
    return this.faqs().filter((f) => f.segments.includes(id));
  }
}
