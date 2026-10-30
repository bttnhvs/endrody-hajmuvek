import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

/*
  Belépési pont – ugyanaz a szerepe, mint az Angular main.ts-ének:
  elindítja a gyökérmodult (AppModule), és beállítja a globális dolgokat.
*/
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  /*
    Ha az API egy tárhelyszolgáltató proxyja mögött fut (Render, Railway...),
    a kérések mind a proxy IP-címéről érkeznek. A 'trust proxy' beállítással
    az Express a valódi látogató IP-jét veszi az X-Forwarded-For fejlécből –
    enélkül a rate limit mindenkit egy kalap alá venne.
  */
  if (config.get<string>('TRUST_PROXY') === 'true') {
    app.set('trust proxy', 1);
  }

  // Minden végpont a /api alatt lesz: /api/inquiries, /api/health ...
  app.setGlobalPrefix('api');

  /*
    Globális validáció: minden bejövő kérés törzsét a DTO osztály
    dekorátorai alapján ellenőrzi (lásd create-inquiry.dto.ts).
    - whitelist: a DTO-ban nem szereplő mezőket eldobja
    - forbidNonWhitelisted: sőt, hibát ad, ha ismeretlen mező jön
    - transform: a sima JSON-ből valódi DTO-példányt csinál
  */
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  /*
    CORS: a böngésző csak akkor engedi, hogy a weboldal (pl. localhost:4201)
    hívja az API-t (localhost:3001), ha az API ezt kifejezetten megengedi.
  */
  const origins = config
    .get<string>('CORS_ORIGIN', 'http://localhost:4201')
    .split(',')
    .map((o) => o.trim());
  app.enableCors({ origin: origins });

  const port = config.get<number>('PORT', 3001);
  await app.listen(port);
  Logger.log(`Az API fut: http://localhost:${port}/api`, 'Bootstrap');
}

void bootstrap();
