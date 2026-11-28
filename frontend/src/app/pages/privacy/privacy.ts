import { Component, computed, inject } from '@angular/core';
import { LanguageService } from '../../core/i18n/language.service';
import { PRIVACY } from '../../core/i18n/privacy';

/*
  Adatkezelési tájékoztató oldal. A szöveg a core/i18n/privacy.ts-ben van, ez a komponens
  csak megjeleníti az aktuális nyelven (computed: nyelvváltáskor magától frissül).
*/
@Component({
  selector: 'app-privacy',
  template: `
    @let p = text();
    <article class="wrap privacy">
      <h1>{{ p.title }}</h1>
      <p class="updated">{{ p.updated }}</p>
      <p class="lead">{{ p.intro }}</p>

      @for (section of p.sections; track section.title) {
        <section>
          <h2>{{ section.title }}</h2>
          @for (paragraph of section.paragraphs ?? []; track $index) {
            <p>{{ paragraph }}</p>
          }
          @if (section.items?.length) {
            <ul>
              @for (item of section.items; track $index) {
                <li>{{ item }}</li>
              }
            </ul>
          }
        </section>
      }
    </article>
  `,
  styles: `
    .privacy {
      padding-block: clamp(3rem, 7vw, 5rem) 0;
      max-width: 48rem;
      margin-inline: auto;
    }
    .updated {
      color: var(--ink-soft);
      font-size: var(--step--1);
    }
    h2 {
      font-size: var(--step-2);
      margin-top: 2.5rem;
    }
    ul {
      margin: 0 0 1em;
      padding-left: 1.25rem;
    }
    li + li {
      margin-top: 0.35rem;
    }
  `,
})
export class Privacy {
  private readonly i18n = inject(LanguageService);
  protected readonly text = computed(() => PRIVACY[this.i18n.lang()]);
}
