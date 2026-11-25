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
  „Még dolgozom rajta” üzenetet mutat (Render cold start). 
- 2026-10-30: **git-repó kész**, GitHubon: https://github.com/bttnhvs/endrody-hajmuvek (ág: `main`). A `.claude/` mappa a `.gitignore`-ban van (bejelentkezési adatok!).
- 2026-11-11: **élesben fut.** Frontend: https://e-hajmuvek.netlify.app (Netlify, a `main` ágról
  automatikusan települ). Backend: https://hajmuvek-api.onrender.com/api (Render Blueprint, Neon DB).
  A CORS (`CORS_ORIGIN`) a Netlify-címre van állítva, ellenőrizve. Az élő űrlap- és admin-próba
  (KITELEPITES.md 6. lépés) még hátravan; a Resend beállítása bizonytalan.
- 2026-11-22: **angol változat** (`/en`, `/en/theatre`, `/en/everyday`, `/en/hair-loss`, `/en/work`,
  `/en/contact`), külső csomag nélkül: `frontend/src/app/core/i18n/` (`LanguageService`, `ui.ts`,
  `site.en.ts`, `content.en.ts`, `en.routes.ts`). Szövegmódosításkor mindkét nyelvet frissíteni kell.
  Az admin csak magyar. Az OFA-szöveg angol oldalon is magyarul marad, alatta a fordítással.
- 2026-11-22: márkanév nyelvenként: magyarul **Endrődy Hajművek**, angolul **Endrődy Wigs** (`SITE.name`,
  `SITE_EN.name`). Domain: **endrodywigs.com**, e-mail: **hello@endrodywigs.com**. A domain ekkor még nem élt
  (nincs DNS/MX), bekötése után a Render `CORS_ORIGIN`-be is fel kell venni.
- 2026-11-22: **workshop-blokk** a főoldal alján (`shared/workshop-teaser`), feliratkozás Formspree-vel.
  A `SITE.workshopFormspreeId` még üres: élesben addig az űrlap helyett egy ajánlatkérő link látszik.
- 2026-11-25: **Judit visszajelzése átvezetve** (`JUDIT-VISSZAJELZES.md`): nem a kézi csomózás a fő üzenet,
  a Szabadtéri csak a referenciákban és a bemutatkozás első mondatában, a hajpótlás-oldal megszűnt
  (`/hajpotlas` → `/mindennapi`, `/en/hair-loss` → `/en/everyday` átirányítás), nincs bérlés, házhoz menés,
  NEAK, csak az online első konzultáció ingyenes, Etsy: Történelmi + Fantasy, új színház- és társulatlista.
  A `hajpotlas` ajánlatkérés-típus a régi rekordok miatt megmaradt, az űrlapon nem választható.
  3. vevőkör: **Styling és alkalmi frizurák** (`/styling`, `/en/styling`); az ajánlatkérésen „egyeb” típust választ,
  mert a backendben nincs külön styling-típus. A Szegedi Nemzeti Színház marad. Nyitott: Operaház, konzultációs díj.

## Lehetséges következő lépések
1. Kitelepítés a `KITELEPITES.md` alapján (fiókok, GitHub-repó – ehhez a felhasználó kell)
2. Swagger (`@nestjs/swagger`), e2e teszt (supertest), TypeORM migrációk
3. Frontend tesztkörnyezet és első komponenstesztek (pl. az admin lista, az űrlap)
4. Adatkezelési tájékoztató oldal (sablon, a barátnőnek kell jóváhagynia)
5. Galéria adatbázisba költöztetése képfeltöltéssel
