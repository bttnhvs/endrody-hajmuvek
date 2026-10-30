import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { SITE } from '../../core/site.config';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.html',
  styleUrl: './site-header.css',
})
export class SiteHeader {
  protected readonly site = SITE;

  protected readonly links = [
    { path: '/szinhaz', label: 'Színháznak' },
    { path: '/mindennapi', label: 'Mindennapra' },
    { path: '/hajpotlas', label: 'Hajvesztés esetén' },
    { path: '/munkaim', label: 'Munkáim' },
  ];

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
