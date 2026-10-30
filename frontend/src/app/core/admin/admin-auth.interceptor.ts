import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AdminAuthService } from './admin-auth.service';

/*
  HttpContextToken – egy "címke", amit egy-egy kérésre ráragaszthatunk.
  Alapértéke false; az AdminApiService minden kérésénél true-ra állítja.

  Miért nem az URL alapján döntünk? Mert a nyilvános POST /api/inquiries és
  az admin GET /api/inquiries URL-je ugyanaz. Így viszont explicit: csak az
  kap tokent, ami kifejezetten admin kérésnek van jelölve – a látogatók
  űrlapküldésébe soha nem kerül bele véletlenül a token.
*/
export const ADMIN_REQUEST = new HttpContextToken<boolean>(() => false);

/*
  Funkcionális interceptor (Angular 15+): sima függvény osztály helyett,
  az inject() itt is működik. Az app.config.ts-ben a
  provideHttpClient(withInterceptors([...])) kapcsolja be.

  Két dolga van:
  1. ráteszi az admin kérésekre az `Authorization: Bearer <token>` fejlécet;
  2. ha a backend 401-et ad (lejárt / megváltozott token), kilépteti az admint
     és visszaküldi a belépő oldalra.
*/
export const adminAuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(ADMIN_REQUEST)) {
    return next(req);
  }

  const auth = inject(AdminAuthService);
  const router = inject(Router);
  const token = auth.token();

  // A kérés objektum megváltoztathatatlan (immutable), ezért clone()-ozunk.
  const authorized = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authorized).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        auth.logout();
        // A belépő oldalon maga a komponens írja ki a hibát, oda nem irányítunk át.
        if (!router.url.startsWith('/admin/belepes')) {
          void router.navigate(['/admin/belepes'], { queryParams: { lejart: 1 } });
        }
      }
      // A hibát továbbadjuk, hogy a hívó is tudjon róla.
      return throwError(() => err);
    }),
  );
};
