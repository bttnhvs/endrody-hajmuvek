import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { routes } from './app.routes';
import { SeoTitleStrategy } from './core/seo-title.strategy';

// Magyar formázás (pénznem, dátum, ezres elválasztó) a pipe-oknak.
registerLocaleData(localeHu);

/*
  Az alkalmazás globális "szolgáltatói" (providers).
  Ez váltja ki a régi AppModule `providers` és `imports` tömbjét.
*/
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      // Oldalváltáskor a lap tetejére ugrik, és működnek a #horgony linkek.
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
      // A query paraméterek (?tipus=hajpotlas) közvetlenül komponens-inputokba kerülnek.
      withComponentInputBinding(),
    ),
    // A HttpClient-tel küldjük az űrlapokat a Netlify Formsnak (lásd core/netlify-forms.service.ts).
    provideHttpClient(withFetch()),
    { provide: LOCALE_ID, useValue: 'hu' },
    // A gyári TitleStrategy helyett a sajátunkat használjuk (SEO).
    { provide: TitleStrategy, useClass: SeoTitleStrategy },
  ],
};
