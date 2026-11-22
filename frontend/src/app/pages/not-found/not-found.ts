import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/i18n/language.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="wrap" style="padding-block: var(--section)">
      <h1>{{ i18n.ui().notFound.title }}</h1>
      <p class="lead">{{ i18n.ui().notFound.lead }}</p>
      <a class="btn" [routerLink]="i18n.path('/')">{{ i18n.ui().common.backHome }}</a>
    </section>
  `,
})
export class NotFound {
  protected readonly i18n = inject(LanguageService);
}
