import { Injectable, computed, signal } from '@angular/core';

const STORAGE_KEY = 'hajmuvek-admin-token';

/*
  AdminAuthService – az admin token tárolása.

  A token egy signalban él, így bárki (guard, interceptor, fejléc) reaktívan
  láthatja, be van-e lépve az admin.

  Miért sessionStorage és nem localStorage?
  - sessionStorage: a böngészőfül bezárásakor törlődik. Ha a barátnőd egy
    közös gépen nézi meg az üzeneteket, utána nem marad bejelentkezve.
  - Oldalfrissítés (F5) után viszont megmarad, így nem kell újra beírni.
  A böngésző jelszókezelője ettől még megjegyezheti a tokent a belépő űrlapon.

  A storage elérése try/catch-ben van: privát módban vagy letiltott
  sütiknél kivételt dobhat, ilyenkor egyszerűen csak memóriában tároljuk.
*/
@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly _token = signal<string | null>(readStoredToken());

  /** Csak olvasható nézet: kívülről nem lehet közvetlenül átírni a tokent. */
  readonly token = this._token.asReadonly();
  readonly isLoggedIn = computed(() => !!this._token());

  login(token: string): void {
    this._token.set(token);
    try {
      sessionStorage.setItem(STORAGE_KEY, token);
    } catch {
      /* nem baj, memóriában megvan */
    }
  }

  logout(): void {
    this._token.set(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* nem baj */
    }
  }
}

function readStoredToken(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
