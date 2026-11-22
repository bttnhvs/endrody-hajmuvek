import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { SITE } from '../../core/site.config';
import { LanguageService } from '../../core/i18n/language.service';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.html',
  styleUrl: './site-header.css',
})
export class SiteHeader {
  protected readonly site = SITE;

  protected readonly i18n = inject(LanguageService);

  /** computed: nyelvváltáskor a címkék és az útvonalak is frissülnek. */
  protected readonly links = computed(() => {
    const nav = this.i18n.ui().nav;
    return [
      { path: this.i18n.path('/szinhaz'), label: nav.theatre },
      { path: this.i18n.path('/mindennapi'), label: nav.everyday },
      { path: this.i18n.path('/hajpotlas'), label: nav.hairLoss },
      { path: this.i18n.path('/munkaim'), label: nav.work },
    ];
  });

  /** Mobilmenü nyitva van-e – signal, így a sablon magától frissül. */
  protected readonly menuOpen = signal(false);

  constructor() {
    // Oldalváltáskor zárjuk be a mobilmenüt.
    // takeUntilDestroyed: automatikusan leiratkozik, ha a komponens megszűnik
    // (nincs memóriaszivárgás, nem kell ngOnDestroy).
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menuOpen.set(false));
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }
}
