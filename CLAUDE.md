# Endrődy Hajművek – projektkontextus Claude számára

## A projekt
Full-stack weboldal az **Endrődy Hajművek Fodrászműhely** számára (egy barátnőm vállalkozása,
Budapest). Kézzel csomózott parókákat készít, eddig főleg színházaknak; a cél, hogy a
mindennapi viseletre és hajvesztés (kemoterápia, alopécia) esetére készült parókák felé is bővüljön.
Ez egyben a **portfólióprojektem**: Angular-fejlesztő vagyok (4 év, medior), most tanulom a backendet.

**Kérés:** magyarul kommunikálj, és amikor kódot írsz vagy módosítasz, magyarázd el, mit és miért –
tanulni szeretnék belőle. A kódkommentek is magyarul vannak.

## Felépítés (monorepo)
```
frontend/   Angular 20 – standalone komponensek, signalok, lazy route-ok, típusos Reactive Forms
backend/    NestJS 11 – TypeORM (sql.js SQLite fejlesztéshez, PostgreSQL élesben), class-validator,
            @nestjs/throttler, Resend (e-mail), tokenes AdminGuard, Jest
```
Részletes magyarázat: `frontend/TANULAS.md`, `backend/TANULAS-BACKEND.md`.

### Frontend – fontos fájlok
- `src/app/core/site.config.ts` – elérhetőségek, `apiUrl`, a "Rólam" szövegei, OFA-támogatói szöveg
- `src/app/core/content.ts` – szegmensek (szinhaz / mindennapi / hajpotlas), folyamat, galéria, GYIK
- `src/app/core/models.ts` – típusok; a munkák kategóriái: karakter / termeszetes / arcszor / muhely
- `src/app/pages/segment/` – egy komponens a három vevőkör-oldalhoz (route data → input binding)
- `src/app/shared/about-maker/` – "Rólam" blokk (`compact` változat a hajpótlás oldalon)
- `public/images/munkak/` – a munkák fotói (1100 px-re kicsinyítve), `public/images/logo.png`,
  `public/images/rolam-illusztracio.svg` (SVG illusztráció a készítőről, később valódi fotóra cserélhető)
- `proxy.conf.json` – `ng serve` alatt az `/api` kéréseket a `localhost:3001`-re továbbítja

### Backend – végpontok
- `GET /api/health`
- `POST /api/inquiries` – ajánlatkérés (validáció, honeypot `website` mező, rate limit 5 / 10 perc)
- `GET /api/inquiries?status=` és `PATCH /api/inquiries/:id/status` – `Authorization: Bearer <ADMIN_TOKEN>`
- Próbakérések: `backend/api.http` (REST Client bővítmény)

## Dizájn
- Színek a logóból: zöld koszorú (`--leaf #8fc27d`, `--sage #668559`, `--green #5e7d53`) és rózsaszín
  rózsák (`--blush #ee97ba`, gombok: `--rose #a8406b`). Fehér háttér, világos levélzöld sávok.
  Kérés volt: **ne legyen túl sötét zöld**, barátságos hangulat.
- Betűk: Bodoni Moda (címek), Hanken Grotesk (szöveg).
- Visszatérő motívum: íves (arch) képkeret + vékony zöld ív (a logó koszorújára utal).
- Lábléc: kötelező OFA / Vállalkozó Start II. támogatói szöveg – maradjon benne.

## Állapot
- 2026-10-29: első futtatás kész. Mindkét projekt települ és fordul, a backend 5 unit tesztje zöld,
  a végpontok és a frontend oldalai böngészőben ellenőrizve. A frontendhez még nincs tesztkörnyezet.
- Ezen a gépen párhuzamosan egy másik weboldal is fejlesztés alatt áll (WSL-ben), ami a 3000-es és
  4200-as portot használja. Ezért:
  - backend: **3001** (`.env` `PORT`, `main.ts` alapértéke, `proxy.conf.json`, `api.http`)
  - frontend: **4201** (`angular.json` → `serve.options.port`, backend `CORS_ORIGIN`)
  Ha portot váltasz, mindegyik helyen át kell írni.
- Helykitöltők (TODO): e-mail, telefonszám (`site.config.ts`), `about.makerName`, a munkák pontos
  címei és a színházi referenciák (melyik paróka melyik előadáshoz készült), árak (`priceFrom: null`).
- 2026-10-29: e-mail küldés Nodemailer/SMTP helyett **Resend** (HTTP API, Render-barát).
  `RESEND_API_KEY` nélkül száraz mód. A vevőnek szóló visszaigazolás alapból ki van kapcsolva
  (`MAIL_CONFIRM_TO_CUSTOMER`). Backend: 10 unit teszt zöld. Resend-kulcs még nincs beállítva.
- 2026-10-29: **admin felület** kész (`/admin`, `/admin/belepes`): token a sessionStorage-ben,
  funkcionális interceptor `HttpContextToken`-nel, guard, signal alapú lista szűrővel és optimista
  állapotváltással. A közös feliratok: `core/inquiry-labels.ts`. Build zöld, böngészőben még nincs
  vizuálisan ellenőrizve.

- 2026-10-29: **kitelepítés előkészítve**: `render.yaml`, `netlify.toml`, `KITELEPITES.md`
  (lépésről lépésre), `frontend/src/environments/` (fejlesztés: `/api`, éles:
  `https://hajmuvek-api.onrender.com/api`, `angular.json` fileReplacements). Az űrlap 4 mp után
  „Még dolgozom rajta” üzenetet mutat (Render cold start). A projekt még NEM git-repó.

## Lehetséges következő lépések
1. Kitelepítés a `KITELEPITES.md` alapján (fiókok, GitHub-repó – ehhez a felhasználó kell)
2. Swagger (`@nestjs/swagger`), e2e teszt (supertest), TypeORM migrációk
3. Frontend tesztkörnyezet és első komponenstesztek (pl. az admin lista, az űrlap)
4. Adatkezelési tájékoztató oldal (sablon, a barátnőnek kell jóváhagynia)
5. Galéria adatbázisba költöztetése képfeltöltéssel
