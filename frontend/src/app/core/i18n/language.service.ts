import { DOCUMENT, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SITE } from '../site.config';
import { SITE_EN, SiteText } from './site.en';
import { UI } from './ui';
import { alternatePath, langOf, localizePath } from './paths';

/*
  LanguageService – az aktuális nyelv egyetlen forrása.

  A nyelv az URL-ből következik (/en/... = angol), nem külön tárolt állapot:
  így a link megosztható, a Google is külön oldalként látja, és a frissítés sem
  váltja vissza a nyelvet. Minden más `computed`, ezért nyelvváltáskor a sablonok
  maguktól frissülnek.

  NavigationEnd-re frissítünk, mert ekkor az új oldal már a helyén van:
  a régi oldal nem villan fel a másik nyelven.
*/
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly url = signal(inject(DOCUMENT).location.pathname);

  readonly lang = computed(() => langOf(this.url()));
  /** A felület feliratai. */
  readonly ui = computed(() => UI[this.lang()]);
  /** A site.config szövegei az aktuális nyelven. */
  readonly site = computed<SiteText>(() => (this.lang() === 'en' ? SITE_EN : SITE));
  /** Ugyanez az oldal a másik nyelven – a nyelvváltó linkje. */
  readonly switchPath = computed(() => alternatePath(this.url()));
  /** Az admin felület csak magyarul van, ott nincs nyelvváltó. */
  readonly isAdmin = computed(() => /^\/admin(\/|$)/.test(this.url()));

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => this.url.set(e.urlAfterRedirects.split(/[?#]/)[0]));
  }

  /** Pl. path('/munkaim') → angolul '/en/work'. */
  path(huPath: string): string {
    return localizePath(huPath, this.lang());
  }
}
