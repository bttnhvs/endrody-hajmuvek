import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { LanguageService } from './i18n/language.service';
import { Lang } from './i18n/paths';
import { UiText } from './i18n/ui';
import { Inquiry } from './models';
import { SITE } from './site.config';

/** A backend válasza sikeres mentés után. */
interface CreateInquiryResponse {
  ok: boolean;
  id: string | null;
}

/*
  InquiryService – az ajánlatkérés elküldése a saját NestJS backendünknek
  (POST /api/inquiries).

  A hibákat itt alakítjuk felhasználónak szóló üzenetté, így a komponensnek
  nem kell tudnia a HTTP-státuszkódokról.
*/
@Injectable({ providedIn: 'root' })
export class InquiryService {
  private readonly http = inject(HttpClient);
  private readonly i18n = inject(LanguageService);

  send(inquiry: Inquiry): Observable<void> {
    return this.http.post<CreateInquiryResponse>(`${SITE.apiUrl}/inquiries`, inquiry).pipe(
      map(() => undefined),
      catchError((err: HttpErrorResponse) =>
        throwError(() => new Error(toUserMessage(err, this.i18n.ui().errors, this.i18n.lang()))),
      ),
    );
  }
}

function toUserMessage(err: HttpErrorResponse, text: UiText['errors'], lang: Lang): string {
  switch (err.status) {
    case 0:
      return text.network;
    case 400: {
      // A NestJS ValidationPipe a hibák listáját a `message` mezőben küldi vissza.
      // Ezek magyarul érkeznek, ezért angol oldalon az általános üzenetet mutatjuk.
      const message: unknown = err.error?.message;
      return lang === 'hu' && Array.isArray(message) ? message.join(' ') : text.invalid;
    }
    case 429:
      return text.rateLimit;
    default:
      return text.generic;
  }
}
