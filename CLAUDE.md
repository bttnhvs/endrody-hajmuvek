# Endrődy Hajművek – projektkontextus Claude számára

## A projekt
Weboldal az **Endrődy Hajművek Fodrászműhely** számára (egy barátnőm, Judit vállalkozása,
Szeged, gyakran Budapesten). Parókákat, pótrészeket és szőrzeteket készít színházaknak, filmeknek
és a mindennapokra, valamint meglévő parókákat alakít át és formáz újra.
Ez egyben a **portfólióprojektem**: Angular-fejlesztő vagyok (4 év, medior).

**Kérés:** magyarul kommunikálj, és amikor kódot írsz vagy módosítasz, magyarázd el, mit és miért –
tanulni szeretnék belőle. A kódkommentek is magyarul vannak.

## Felépítés
```
frontend/   Angular 20 – standalone komponensek, signalok, lazy route-ok, típusos Reactive Forms
netlify.toml  a Netlify build- és átirányítási beállításai (a repó gyökerében)
```
Saját backend nincs: az űrlapokat a **Netlify Forms** fogadja. (2026-11-28-ig volt egy NestJS backend
Render + Neon + Resend szolgáltatásokkal, és egy `/admin` oldal – ezek a git előzményekben megvannak.)
Részletes magyarázat: `frontend/TANULAS.md`, kitelepítés: `KITELEPITES.md`.

### Frontend – fontos fájlok
- `src/app/core/site.config.ts` – elérhetőségek, linkek, a "Rólam" szövegei, színházak, referenciák,
  OFA-támogatói szöveg, és a **`underConstruction`** kapcsoló (felső sáv + noindex)
- `src/app/core/content.ts` – vevőkörök (szinhaz / mindennapi / styling), folyamat, galéria, GYIK
- `src/app/core/i18n/` – angol változat: `LanguageService`, `ui.ts` (feliratok), `site.en.ts`,
  `content.en.ts`, `en.routes.ts`, `paths.ts` (útvonalak), `privacy.ts` (adatkezelési tájékoztató HU+EN)
- `src/app/core/netlify-forms.service.ts` – az űrlapok beküldése a Netlify Formsnak
- `public/__forms.html` – az űrlapok **rejtett statikus másolata**, hogy a Netlify felismerje őket.
  Ha egy Angular-űrlapon új mezőt veszel fel, ide is be kell írni ugyanazzal a névvel!
- `src/app/pages/segment/` – egy komponens a három vevőkör-oldalhoz (route data → input binding)
- `src/app/shared/workshop-teaser/` – workshop-blokk feliratkozással
- `public/images/munkak/` – a munkák fotói (1100 px-re kicsinyítve), `public/images/og-image.jpg`
  (linkelőnézet), favicon és telefonos ikonok a `public/` gyökerében

### Űrlapok (Netlify Forms)
- `ajanlatkeres`: bot-field, type (magyar felirat), name, email, phone, message, consent, language
- `workshop`: bot-field, email, consent, language
- Beküldés: `POST /__forms.html`, `application/x-www-form-urlencoded`, `form-name` mezővel.
  Honeypot: `bot-field` (`netlify-honeypot="bot-field"`). `ng serve` alatt nincs Netlify, ott a
  szolgáltatás csak szimulálja a küldést (`isDevMode()`).

## Dizájn
- Színek a logóból: zöld koszorú (`--leaf #8fc27d`, `--sage #668559`, `--green #5e7d53`) és rózsaszín
  rózsák (`--blush #ee97ba`, gombok: `--rose #a8406b`). Fehér háttér, világos levélzöld sávok.
  Kérés volt: **ne legyen túl sötét zöld**, barátságos hangulat.
- Betűk: Bodoni Moda (címek), Hanken Grotesk (szöveg). Saját szerverről (Fontsource npm-csomagok,
  `angular.json` → `styles`), nem a Google Fonts-ból, ezért a CSS-ben a nevük „… Variable”.
- Visszatérő motívum: íves (arch) képkeret + vékony zöld ív (a logó koszorújára utal).
- Asztali nézetben a `html` betűmérete 72% (1200 px felett), a címek külön skálát kapnak.
- Lábléc: kötelező OFA / Vállalkozó Start II. támogatói szöveg – maradjon benne.

## Tartalmi szabályok (Judit kérései)
- Nem a „kézzel csomózott” a fő üzenet (punching és tressz is van). A Szegedi Szabadtéri Játékok csak
  a referenciákban és a bemutatkozás első mondatában szerepel.
- Nincs: hajvesztés-oldal (`/hajpotlas` → `/mindennapi` átirányítás), bérlés, gyors csere, házhoz menés,
  NEAK, cosplay szó, Vámpírok bálja. Csak az **online** első konzultáció ingyenes, a személyes fizetős.
- Szövegmódosításkor **mindkét nyelvet** frissíteni kell.

## Állapot
- Ezen a gépen párhuzamosan egy másik weboldal is fejlesztés alatt áll (WSL-ben), ami a 4200-as portot
  használja, ezért a frontend a **4201**-en fut (`angular.json` → `serve.options.port`).
- Élesben: https://e-hajmuvek.netlify.app (Netlify, a `main` ágról automatikusan települ).
  GitHub: https://github.com/bttnhvs/endrody-hajmuvek. A `.claude/` mappa a `.gitignore`-ban van.
- Domain: **endrodywigs.com**, e-mail: **hello@endrodywigs.com** – 2026-11-22-én még nem élt.
- Márkanév nyelvenként: magyarul **Endrődy Hajművek**, angolul **Endrődy Wigs**.
- 2026-11-28: **Netlify Formsra váltás**, a backend, az admin, a Render/Neon/Resend/Formspree törölve.
  A Netlifyban kézzel be kell kapcsolni a form-észlelést és az e-mail-értesítést (lásd KITELEPITES.md).
- 2026-11-28: **fejlesztés alatti mód** bekapcsolva (`SITE.underConstruction: true`): felső sáv +
  `noindex`. Élesítéskor `false`. A hero a `--notice-h` CSS-változóval vonja le a sáv magasságát.
- Helykitöltők (TODO): telefonszám, Etsy-link, az adatkezelési tájékoztató [szögletes zárójeles] részei
  (adatkezelő neve, székhely, adószám, dátum, megőrzési idő, USA-adattovábbítás), `about.makerName`.
- Nyitott kérdések Juditnak: Operaház a listán, személyes konzultáció díja, Styling-oldal szövege,
  három „kézzel csomózott” képaláírás.

## Lehetséges következő lépések
1. Az adatkezelési tájékoztató kitöltése, majd `underConstruction: false` és élesítés
2. Saját domain bekötése a Netlifyban
3. Frontend tesztkörnyezet és első komponenstesztek (pl. az űrlap validációja)
4. Prerender (`@angular/ssr`), hogy az angol oldalaknak is saját linkelőnézetük legyen
