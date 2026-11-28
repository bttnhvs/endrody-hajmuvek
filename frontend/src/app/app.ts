import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeader } from './shared/site-header/site-header';
import { SiteFooter } from './shared/site-footer/site-footer';
import { LanguageService } from './core/i18n/language.service';
import { SITE } from './core/site.config';

/*
  Gyökérkomponens: a fejléc és lábléc mindig látszik,
  közöttük a <router-outlet> cseréli az aktuális oldalt.
*/
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  host: {
    // A sáv magassága CSS-változóként: a hero ebből számol (lásd home.css).
    '[style.--notice-h]': "underConstruction ? '2.25rem' : '0px'",
  },
  template: `
    <a class="skip-link" href="#tartalom">{{ i18n.ui().common.skip }}</a>
    @if (underConstruction) {
      <p class="notice" role="status">{{ i18n.ui().common.notice }}</p>
    }
    <app-site-header />
    <main id="tartalom" tabindex="-1">
      <router-outlet />
    </main>
    <app-site-footer />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100dvh;
    }
    main {
      flex: 1;
      outline: none;
    }
    /* Billentyűzetes felhasználóknak: Tab-ra megjelenik */
    .skip-link {
      position: absolute;
      left: 1rem;
      top: -4rem;
      z-index: 100;
      padding: 0.6rem 1rem;
      background: var(--ink);
      color: var(--paper);
      border-radius: var(--radius-sm);
    }
    /* Fejlesztés alatti sáv: jól látható, de visszafogott (halvány levélzöld, kis betű). */
    .notice {
      margin: 0;
      /* A globális p { max-width: 62ch } itt nem kell: a sáv teljes szélességű. */
      max-width: none;
      min-height: var(--notice-h);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.35rem var(--gutter);
      background: var(--leaf-tint);
      color: var(--ink);
      border-bottom: 1px solid var(--line);
      font-size: var(--step--1);
      font-weight: 500;
      text-align: center;
      line-height: 1.35;
    }
    .skip-link:focus {
      top: 1rem;
    }
  `,
})
export class App {
  protected readonly i18n = inject(LanguageService);
  protected readonly underConstruction = SITE.underConstruction;
}
