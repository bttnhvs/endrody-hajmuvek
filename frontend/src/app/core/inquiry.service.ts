import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
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

  send(inquiry: Inquiry): Observable<void> {
    return this.http.post<CreateInquiryResponse>(`${SITE.apiUrl}/inquiries`, inquiry).pipe(
      map(() => undefined),
      catchError((err: HttpErrorResponse) => throwError(() => new Error(toUserMessage(err)))),
    );
  }
}

function toUserMessage(err: HttpErrorResponse): string {
  switch (err.status) {
    case 0:
      return 'Nem sikerült elérni a szervert. Ellenőrizd az internetkapcsolatot, és próbáld újra.';
    case 400: {
      // A NestJS ValidationPipe a hibák listáját a `message` mezőben küldi vissza.
      const message: unknown = err.error?.message;
      return Array.isArray(message) ? message.join(' ') : 'Néhány mező hibásan van kitöltve.';
    }
    case 429:
      return 'Rövid időn belül túl sok üzenet érkezett innen. Próbáld újra néhány perc múlva.';
    default:
      return 'Nem sikerült elküldeni az üzenetet. Próbáld újra később.';
  }
}
