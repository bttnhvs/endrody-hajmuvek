import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from './admin-auth.service';

/*
  Route guard: csak belépett admin nyithatja meg az oldalt.

  Ha nincs token, nem false-t adunk vissza (az egy üres oldalt eredményezne),
  hanem egy UrlTree-t: a router ilyenkor átirányít a belépő oldalra.

  FONTOS: ez csak kényelmi funkció, nem biztonsági védelem. A frontend kódja
  a böngészőben fut, bárki megkerülheti. A valódi védelem a backend
  AdminGuard-ja: token nélkül az API nem ad ki adatot.
*/
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AdminAuthService);
  const router = inject(Router);
  return auth.isLoggedIn() || router.createUrlTree(['/admin/belepes']);
};
