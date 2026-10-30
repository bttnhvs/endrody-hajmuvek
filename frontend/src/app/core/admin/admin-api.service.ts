import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AdminInquiry, InquiryStatus } from '../models';
import { SITE } from '../site.config';
import { ADMIN_REQUEST } from './admin-auth.interceptor';

/*
  Az admin végpontok hívása. Minden kérés megkapja az ADMIN_REQUEST
  címkét, ebből tudja az interceptor, hogy tokent kell rátennie.
*/
@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly context = new HttpContext().set(ADMIN_REQUEST, true);

  /** Az összes ajánlatkérés, a legújabb elöl. A szűrést a kliens végzi (lásd a listát). */
  list(): Observable<AdminInquiry[]> {
    return this.http
      .get<AdminInquiry[]>(`${SITE.apiUrl}/inquiries`, { context: this.context })
      .pipe(catchError(toUserError));
  }

  updateStatus(id: string, status: InquiryStatus): Observable<AdminInquiry> {
    return this.http
      .patch<AdminInquiry>(
        `${SITE.apiUrl}/inquiries/${encodeURIComponent(id)}/status`,
        { status },
        { context: this.context },
      )
      .pipe(catchError(toUserError));
  }
}

/** Az admin oldalon megjeleníthető hiba; a `status` alapján a komponens dönthet. */
export class AdminApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function toUserError(err: HttpErrorResponse) {
  const message =
    err.status === 0
      ? 'Nem sikerült elérni a szervert. Lehet, hogy épp most indul (ez fél percig is tarthat), próbáld újra.'
      : err.status === 401
        ? 'Hibás vagy lejárt belépési kód.'
        : err.status === 404
          ? 'Ez az ajánlatkérés már nem létezik.'
          : 'Váratlan hiba történt. Próbáld újra később.';
  return throwError(() => new AdminApiError(message, err.status));
}
