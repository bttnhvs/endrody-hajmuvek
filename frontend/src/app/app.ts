import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeader } from './shared/site-header/site-header';
import { SiteFooter } from './shared/site-footer/site-footer';

/*
  Gyökérkomponens: a fejléc és lábléc mindig látszik,
  közöttük a <router-outlet> cseréli az aktuális oldalt.
*/
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  template: `
    <a class="skip-link" href="#tartalom">Ugrás a tartalomra</a>
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
    .skip-link:focus {
      top: 1rem;
    }
  `,
})
export class App {}
