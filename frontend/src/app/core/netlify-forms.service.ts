import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, isDevMode } from '@angular/core';
import { Observable, catchError, delay, map, of, throwError } from 'rxjs';
import { LanguageService } from './i18n/language.service';

/** A Netlify által ismert űrlapok – a nevük egyezik a public/__forms.html-ben lévőkkel. */
export type NetlifyFormName = 'ajanlatkeres' | 'workshop';

/*
  A rejtett statikus űrlapokat tartalmazó fájl. Ide küldjük a beküldést, mert ez valódi,
  létező fájl: így a netlify.toml SPA-átirányítása (/* → /index.html) biztosan nem nyúl hozzá.
*/
const FORMS_ENDPOINT = '/__forms.html';

/*
  NetlifyFormsService – az űrlapok beküldése a Netlify Formsnak.

  Hogyan működik a Netlify Forms egy Angular SPA-ban?
  1. Kitelepítéskor a Netlify végignézi a statikus HTML-fájlokat, és megkeresi a
     `data-netlify="true"` jelölésű űrlapokat. Az Angular az űrlapokat JavaScriptből rajzolja ki,
     ezeket a Netlify nem látja – ezért van egy rejtett, statikus másolatuk a public/__forms.html-ben.
  2. Beküldéskor egy sima, "x-www-form-urlencoded" POST kérést küldünk a `form-name` mezővel;
     a Netlify ebből tudja, melyik űrlaphoz tartozik.
  3. A honeypot mező neve `bot-field` (a statikus űrlapon `netlify-honeypot="bot-field"`):
     ha egy robot kitölti, a Netlify csendben eldobja a beküldést.

  Fejlesztés közben (`ng serve`) nincs Netlify, ezért ott csak szimuláljuk a sikeres küldést.
*/
@Injectable({ providedIn: 'root' })
export class NetlifyFormsService {
  private readonly http = inject(HttpClient);
  private readonly i18n = inject(LanguageService);

  submit(formName: NetlifyFormName, fields: Record<string, string>): Observable<void> {
    if (isDevMode()) {
      console.info(`[fejlesztői mód] A(z) "${formName}" űrlap nem lett elküldve:`, fields);
      return of(undefined).pipe(delay(400));
    }

    // A URLSearchParams helyesen kódolja a különleges karaktereket (pl. + az e-mail-címben).
    const body = new URLSearchParams({ 'form-name': formName, ...fields }).toString();
    return this.http
      .post(FORMS_ENDPOINT, body, {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
        responseType: 'text',
      })
      .pipe(
        map(() => undefined),
        catchError((err: HttpErrorResponse) => {
          const text = this.i18n.ui().errors;
          return throwError(() => new Error(err.status === 0 ? text.network : text.generic));
        }),
      );
  }
}
