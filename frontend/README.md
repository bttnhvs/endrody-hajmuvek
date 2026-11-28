# Endrődy Hajművek Fodrászműhely

Weboldal egy szegedi parókakészítő műhelynek: parókák, pótrészek és szőrzetek színházaknak,
filmeknek és a mindennapokra, valamint meglévő parókák átalakítása. Magyarul és angolul.

## Indítás

```bash
npm install
npm start          # http://localhost:4201
npm run build      # éles build: dist/hajmuvek
```

Node.js 20.19+ vagy 22.12+ szükséges.

## Technika

- Angular 20, standalone komponensek, nincs NgModule
- Signalok (`signal`, `computed`, `input`) az állapotkezeléshez
- Lazy loaded route-ok; egy újrahasznosított oldal-komponens a három vevőkörre (route data → input binding)
- Típusos Reactive Forms, beküldés a Netlify Formsnak honeypot spamvédelemmel
- Kétnyelvűség külső csomag nélkül (`core/i18n/`), nyelvenkénti URL-ekkel
- Saját `TitleStrategy` a route-onkénti címhez, meta descriptionhöz és hreflang-hoz
- `NgOptimizedImage` a munkák fotóihoz (lusta betöltés, CLS-mentes elrendezés)
- Design tokenek CSS-változókban (a logó színeiből), saját szerverről kiszolgált betűtípusok

## Beállítás

Az elérhetőségeket és a fejlesztés alatti kapcsolót a `src/app/core/site.config.ts`,
a szövegeket és a galériát a `src/app/core/content.ts` (angolul: `src/app/core/i18n/`) tartalmazza.

Részletes magyarázat: [TANULAS.md](TANULAS.md)
