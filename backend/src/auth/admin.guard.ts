import { timingSafeEqual } from 'node:crypto';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

/*
  Guard = "kapuőr". Ugyanaz az ötlet, mint az Angular route guard-jai
  (canActivate): eldönti, hogy a kérés továbbmehet-e a controllerhez.

  Ez a legegyszerűbb működő védelem egyetlen adminnak: a kérésnek a
  fejlécében el kell küldenie a titkos tokent:
    Authorization: Bearer <ADMIN_TOKEN>

  Ha később több felhasználó lesz (pl. admin felület bejelentkezéssel),
  ezt érdemes JWT-alapú hitelesítésre cserélni (@nestjs/jwt, @nestjs/passport).
*/
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const expected = this.config.get<string>('ADMIN_TOKEN') ?? '';
    // Ha nincs beállítva token, senkit nem engedünk be (biztonságos alapértelmezés).
    if (expected.length < 16) {
      throw new UnauthorizedException('Az admin hozzáférés nincs beállítva (ADMIN_TOKEN).');
    }

    const request = context.switchToHttp().getRequest<Request>();
    const header = request.headers.authorization ?? '';
    const given = header.startsWith('Bearer ') ? header.slice(7) : '';

    if (!safeEqual(given, expected)) {
      throw new UnauthorizedException('Hibás vagy hiányzó admin token.');
    }
    return true;
  }
}

/*
  Időben állandó összehasonlítás: a sima `===` hamarabb tér vissza, ha már
  az első karakter eltér, és ebből a válaszidőből elvileg ki lehetne
  találgatni a tokent. A timingSafeEqual mindig ugyanannyi ideig fut.
*/
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}
