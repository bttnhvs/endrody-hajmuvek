# Hajművek API – tanulási útmutató (NestJS)

Ez a fájl végigvezet a backenden. Angular-fejlesztőként sok minden ismerős lesz:
a NestJS szándékosan az Angular felépítését követi. Ahol lehet, párhuzamot vonok.

---

## 0. Indítás

```bash
cd backend
npm install
copy .env.example .env      # macOS/Linux: cp .env.example .env
npm run start:dev           # figyeli a fájlokat, mentésre újraindul
```

Nyisd meg: http://localhost:3001/api/health → `{"status":"ok", ...}`

Utána egy **másik** terminálban a frontend:

```bash
cd frontend
npm start                   # http://localhost:4201
```

Töltsd ki az ajánlatkérő űrlapot. A backend konzolján megjelenik a két e-mail
"száraz módban" (értesítés a műhelynek + visszaigazolás a vevőnek), az adat pedig
bekerül a `data/hajmuvek.sqlite` fájlba.

Kipróbálni az admin végpontokat a legkényelmesebb az **`api.http`** fájlból:
telepítsd a VS Code *REST Client* bővítményét, és kattints a „Send Request” linkre.

---

## 1. Egy kérés útja

Mi történik, amikor valaki megnyomja az „Üzenet küldése” gombot?

```
Böngésző (Angular, localhost:4201)
   │  POST /api/inquiries   { type, name, email, ... }
   ▼
ng serve proxy  (proxy.conf.json)  ──►  localhost:3001
   ▼
NestJS
   ├─ ThrottlerGuard      túl sok kérés egy IP-ről? → 429
   ├─ ValidationPipe      a törzs megfelel a CreateInquiryDto-nak? → különben 400
   ├─ InquiriesController.create()      vékony: csak továbbad
   ├─ InquiriesService.create()         üzleti logika: honeypot, mentés, e-mail
   │     ├─ Repository<Inquiry>.save()  → SQLite / PostgreSQL
   │     └─ MailService                 → Resend API (vagy konzol)
   ▼
201 Created   { ok: true, id: "…" }
```

A sorrend fontos: a guard és a pipe még a controller **előtt** fut, így a
controllerbe már csak engedélyezett és érvényes adat jut el.

---

## 2. Mappaszerkezet

```
src/
  main.ts                    belépési pont: globális prefix, validáció, CORS
  app.module.ts              gyökérmodul: config, adatbázis, rate limit
  health.controller.ts       GET /api/health
  auth/
    admin.guard.ts           tokenes védelem az admin végpontokhoz
  mail/
    mail.module.ts
    mail.service.ts          e-mail küldés (Resend)
    mail.service.spec.ts     unit teszt, mockolt Resenddel
  inquiries/                 "feature modul" – minden, ami az ajánlatkérésekhez kell
    inquiries.module.ts
    inquiries.controller.ts  végpontok
    inquiries.service.ts     logika
    inquiries.service.spec.ts  unit tesztek
    inquiry.entity.ts        adatbázis-tábla
    inquiry.types.ts         közös konstansok (típusok, állapotok)
    dto/
      create-inquiry.dto.ts  mit fogadunk el a POST-ban
      update-status.dto.ts
```

---

## 3. Angular ↔ NestJS szótár

| Angular | NestJS | Itt a projektben |
|---|---|---|
| `NgModule` (régi stílus) | `@Module` | `InquiriesModule`, `MailModule` |
| `@Injectable` service | `@Injectable` provider | `InquiriesService`, `MailService` |
| `inject()` / konstruktor DI | konstruktor DI | `constructor(private readonly mail: MailService)` |
| komponens | controller | `InquiriesController` |
| route guard (`canActivate`) | guard (`CanActivate`) | `AdminGuard`, `ThrottlerGuard` |
| pipe (megjelenítéshez) | pipe (bemenet ellenőrzés/átalakítás) | `ValidationPipe`, `ParseUUIDPipe` |
| `Validators.required` | `class-validator` dekorátorok | `create-inquiry.dto.ts` |
| HTTP interceptor | interceptor | (még nincs – lásd feladatok) |
| `TestBed` | `Test.createTestingModule` | `inquiries.service.spec.ts` |

A legnagyobb különbség: Angularban a DI a böngészőben él, egy felhasználóhoz.
Nestben a service-ek **egy példányban** szolgálnak ki minden felhasználót egyszerre,
ezért nem tárolhatsz bennük kérésenkénti állapotot (pl. „az aktuális felhasználó” mezőt).

---

## 4. Modulok és függőség-befecskendezés

```ts
@Module({
  imports: [TypeOrmModule.forFeature([Inquiry]), MailModule],
  controllers: [InquiriesController],
  providers: [InquiriesService, AdminGuard],
})
export class InquiriesModule {}
```

- `imports`: más modulok, amiknek az *exportált* elemeit használni akarjuk.
  A `MailModule` az `exports: [MailService]`-szel teszi elérhetővé a levelezőt.
- `TypeOrmModule.forFeature([Inquiry])` hozza létre a `Repository<Inquiry>`-t,
  amit a service `@InjectRepository(Inquiry)`-vel kér el.
- `ConfigModule.forRoot({ isGlobal: true })` (az `app.module.ts`-ben) miatt a
  `ConfigService` bárhol injektálható importálás nélkül.

**`forRoot` vs `forRootAsync`:** az adatbázis beállításai a `.env`-ből jönnek, ezért
meg kell várni, amíg a `ConfigService` elkészül. A `forRootAsync` egy factory
függvényt kap, amibe a Nest beinjektálja a `ConfigService`-t (`inject: [ConfigService]`).

---

## 5. Controller

```ts
@Post()
@HttpCode(201)
@Throttle({ default: { limit: 5, ttl: 10 * 60_000 } })
async create(@Body() dto: CreateInquiryDto) { ... }
```

- `@Post()`, `@Get()`, `@Patch(':id/status')` – HTTP-metódus és útvonal.
- `@Body()`, `@Param('id')`, `@Query('status')` – honnan jön a paraméter.
- A visszatérési értéket a Nest automatikusan JSON-né alakítja. Ha a metódus
  `Promise`-t ad vissza, megvárja.
- A controller **vékony**: nincs benne logika, csak fogadja és továbbadja a kérést.
  Így a logikát a service-ben HTTP nélkül is tesztelni lehet.

---

## 6. DTO és validáció

A `CreateInquiryDto` osztály dekorátorai a szabályok. A `main.ts`-ben beállított
globális `ValidationPipe` minden kérésnél lefuttatja őket:

```ts
new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })
```

- **whitelist**: a DTO-ban nem szereplő mezőket eldobja. Így senki nem tud pl. egy
  `status: "lezarva"` mezőt becsempészni az új ajánlatkérésbe.
- **forbidNonWhitelisted**: sőt, ilyenkor 400-as hibát ad.
- **transform**: a JSON-ből valódi `CreateInquiryDto` példány lesz, és lefutnak a
  `@Transform` dekorátorok (itt: szóközök levágása).

**Miért validál a backend is, ha a frontend már megtette?** Mert a frontendet meg lehet
kerülni: bárki küldhet kérést közvetlenül az API-nak (curl, Postman, egy robot). A frontend
validáció a felhasználónak szól (azonnali visszajelzés), a backend a **biztonságnak**.

Próbáld ki: az `api.http` „Hibás kérés” blokkja – a válaszban a magyar hibaüzenetek listája jön.

---

## 7. Adatbázis: Entity, Repository, TypeORM

```ts
@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ type: 'varchar', length: 100 }) name!: string;
  @CreateDateColumn() createdAt!: Date;
  ...
}
```

Az entity egy tábla leírása. A service a `Repository<Inquiry>`-n keresztül dolgozik vele:

| Művelet | Kód | SQL megfelelője |
|---|---|---|
| létrehozás | `repo.create({...})` + `repo.save(x)` | `INSERT` |
| lista | `repo.find({ where, order })` | `SELECT ... WHERE ... ORDER BY` |
| egy elem | `repo.findOneBy({ id })` | `SELECT ... WHERE id = ?` |
| módosítás | módosítod az objektumot, `repo.save(x)` | `UPDATE` |

**Két adatbázis, egy kód.** Fejlesztéshez SQLite (`sql.js` – tisztán JavaScript, Windowson sem
kell hozzá fordítani semmit), élesben PostgreSQL. Az `app.module.ts` a `DATABASE_URL`
megléte alapján dönt. A kódnak ezért adatbázis-függetlennek kell lennie – ezért `varchar` az
állapot és a típus, nem adatbázis-szintű enum.

**`synchronize` vs. migrációk.** `DB_SYNC=true` esetén a TypeORM minden induláskor az entity-khez
igazítja a táblákat. Fejlesztéshez kényelmes, de élesben veszélyes: egy átnevezett mező a régi
oszlop *törlésével* járhat. Ha már valódi adatok vannak, kapcsold ki, és használj migrációkat
(`typeorm migration:generate`) – ez az egyik gyakorló feladat.

---

## 8. Guardok: rate limit és admin védelem

**ThrottlerGuard** – globálisan be van kötve (`APP_GUARD` az `app.module.ts`-ben):
alapból 60 kérés/perc/IP. Az ajánlatkérés végpontján a `@Throttle` szigorít: 5 kérés / 10 perc.
Túllépéskor 429-es választ kap a kliens, amit a frontend `InquiryService` érthető üzenetté alakít.

**AdminGuard** – a listázó és állapotmódosító végpontokon (`@UseGuards(AdminGuard)`).
A kérés fejlécében várja a titkos tokent: `Authorization: Bearer <ADMIN_TOKEN>`.

Két apróság, ami interjún jól mutat:
- Ha nincs beállítva `ADMIN_TOKEN`, **senkit** nem enged be (biztonságos alapértelmezés,
  „fail closed”), nem pedig mindenkit.
- A tokent `timingSafeEqual`-lal hasonlítja össze. A sima `===` az első eltérő karakternél
  megáll, és a válaszidőből elvileg ki lehetne találgatni a tokent karakterenként.

Egy felhasználónak ez elég. Ha lesz admin felület bejelentkezéssel, ezt JWT-re érdemes cserélni.

---

## 9. E-mail

A `MailService` a [Resend](https://resend.com) szolgáltatással küld. Ha nincs `RESEND_API_KEY`,
csak kiírja a konzolra („száraz mód”).

**Miért Resend és nem SMTP (pl. Gmail)?**
- A Resend sima HTTPS-kérést használ. Sok ingyenes tárhely (pl. a Render) a kimenő SMTP-portokat
  korlátozza, a HTTPS-t viszont nem.
- Saját domainnel a Resend aláírja a leveleket (SPF/DKIM), így nem kerülnek spambe. Ha egy
  Gmail-címről küldenénk idegen szerverről, gyakran spambe kerülne a levél.

**Domain nélkül vagy domainnel:**
- Domain nélkül a feladó `onboarding@resend.dev`, és a levél **csak a Resend-fiók saját címére**
  mehet. Ezért a fiókot a barátnőm címével kell regisztrálni (ez a `MAIL_TO`). Az értesítő így
  működik, a vevőnek szóló visszaigazolás viszont nem.
- Ha a domain (pl. `hajmuvek.hu`) a Resendben ellenőrizve van (néhány DNS-rekordot kell
  felvenni), a `MAIL_FROM` lehet `hello@hajmuvek.hu`, és bekapcsolható a
  `MAIL_CONFIRM_TO_CUSTOMER=true`.

**A Resend kliens nem dob kivételt hibánál**, hanem `{ data, error }` objektumot ad vissza
(hasonlóan a Go nyelv vagy a Supabase stílusához). A `send()` ezt maga alakítja kivétellé,
különben a `Promise.allSettled` sikeresnek látná a hibás küldést, és semmi nem kerülne a naplóba.
Ezt teszt is ellenőrzi (`mail.service.spec.ts`).

**A vevőnek szóló visszaigazolás alapból ki van kapcsolva.** Bárki beírhatja az űrlapba valaki más
e-mail-címét, és ilyenkor mi küldenénk neki kéretlen levelet. A honeypot és a rate limit ezt
fékezi, de nem zárja ki.

Három dolog, amire még figyeltem:
1. **HTML-escape**: a felhasználó által beírt szöveg (név, üzenet) `escapeHtml()`-en megy át,
   mielőtt az e-mail HTML-jébe kerül. Különben valaki a nevébe írt HTML-lel átformálhatná
   a barátnőd által kapott levelet (pl. hamis linkkel).
2. **`replyTo`**: az értesítőben a „Válasz” gomb egyből a vevőnek ír.
3. **`Promise.allSettled`**: ha az e-mail-szerver épp nem elérhető, az ajánlatkérés attól még
   el van mentve, és a vevő sikeres választ kap. A hibát csak naplózzuk.

Beállítás: Resend-regisztráció → API Keys → Create API Key → a `re_` kezdetű kulcs a
`RESEND_API_KEY`-be kerül. A többi változó magyarázata a `.env.example`-ben van.

---

## 10. Konfiguráció és titkok

Minden, ami környezetenként más, vagy titkos, a `.env`-ben van – a kódban soha.
A `.env` a `.gitignore`-ban van, a repóba csak a kitöltetlen `.env.example` kerül.
Élesben a tárhelyszolgáltató felületén állítod be ugyanezeket a változókat.

---

## 11. Tesztelés

```bash
npm test
```

Az `inquiries.service.spec.ts` a service-t valódi adatbázis és e-mail nélkül teszteli: a
repository-t és a `MailService`-t mockokra cseréli (`useValue`). Pont úgy, mint Angularban a
`TestBed` `providers` tömbjében. Öt eset van lefedve: mentés, értesítések, e-mail-hiba,
honeypot, nem létező azonosító.

---

## 12. Kitelepítés (élesítés)

Egy ingyenes, kezdőbarát összeállítás:

1. **Adatbázis**: PostgreSQL a [Neon](https://neon.tech)-en → kapsz egy `DATABASE_URL`-t.
2. **Backend**: [Render](https://render.com) „Web Service” a GitHub-repóból
   - Build: `npm install && npm run build`, Start: `npm run start:prod`
   - Környezeti változók: `DATABASE_URL`, `ADMIN_TOKEN`, `CORS_ORIGIN` (a weboldal címe),
     `TRUST_PROXY=true`, `RESEND_API_KEY`, `MAIL_TO` (és domainnel `MAIL_FROM`)
3. **Frontend**: Netlify vagy Vercel; előtte a `site.config.ts` → `apiUrl` legyen a backend
   teljes címe, pl. `https://hajmuvek-api.onrender.com/api`.

A Render ingyenes csomagja inaktivitás után „elalszik”, az első kérés ilyenkor lassú
(fél perc is lehet). Egy kis műhely ajánlatkéréseinél ez elfogadható.

---

## 13. Gyakorló feladatok

1. **Swagger dokumentáció**: `@nestjs/swagger` → automatikus, kipróbálható API-leírás a `/api/docs` alatt.
2. **Admin oldal Angularban**: `/admin` route a weboldalon, ahol a barátnőd a tokennel belépve
   látja és lezárhatja az ajánlatkéréseket. Gyakorolhatod: HTTP interceptor (a token fejlécbe
   tétele), route guard, signal alapú lista.
3. **Galéria API**: a munkák (`content.ts` → `GALLERY`) adatbázisba költöztetése, képfeltöltéssel
   (`FileInterceptor`), hogy a barátnőd maga tölthessen fel új munkát.
4. **Migrációk**: `DB_SYNC=false`, és TypeORM migrációk generálása.
5. **E2E teszt**: `supertest`-tel a teljes kérés-útvonal tesztelése (guard + pipe + controller).
6. **Időpontfoglalás**: új modul (`AppointmentsModule`) szabad időpontokkal.

---

## 14. Hogyan mutasd be interjún?

- „Egy valódi kisvállalkozásnak építettem full-stack megoldást: Angular 20 frontend és
  NestJS backend, TypeScript mindkét oldalon.”
- Biztonság: szerveroldali validáció whitelisttel, rate limiting, honeypot, HTML-escape,
  fail-closed admin guard időben állandó összehasonlítással, titkok `.env`-ben.
- Robusztusság: az e-mail-hiba nem veszti el az ajánlatkérést; adatbázis-független entity-k.
- Tesztek: unit tesztek mockolt függőségekkel.
- Ha élesben fut: „X ajánlatkérés érkezett rajta keresztül.”
