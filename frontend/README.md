# Endrődy Hajművek Fodrászműhely

Weboldal egy budapesti parókakészítő műhelynek, amely színházi parókák mellett mindennapi
viseletre és hajvesztés esetére is készít egyedi, kézzel csomózott parókákat.

## Indítás

```bash
npm install
npm start          # http://localhost:4201  (a backendet külön indítsd: ../backend)
npm run build      # éles build: dist/hajmuvek
```

Node.js 20.19+ vagy 22.12+ szükséges.

## Technika

- Angular 20, standalone komponensek, nincs NgModule
- Signalok (`signal`, `computed`, `input`) az állapotkezeléshez
- Lazy loaded route-ok; egy újrahasznosított oldal-komponens a három vevőkörre (route data → input binding)
- Típusos Reactive Forms az ajánlatkéréshez, saját NestJS backenddel (`../backend`), honeypot spamvédelemmel
- Saját `TitleStrategy` a route-onkénti címhez és meta descriptionhöz
- `NgOptimizedImage` a munkák fotóihoz (lusta betöltés, CLS-mentes elrendezés)
- Design tokenek CSS-változókban (a logó színeiből), reszponzív `clamp()` típusskála, akadálymentes navigáció

## Beállítás

Az elérhetőségeket és az űrlap-végpontot a `src/app/core/site.config.ts`,
a szövegeket és a galériát a `src/app/core/content.ts` tartalmazza.

Részletes magyarázat: [TANULAS.md](TANULAS.md)
