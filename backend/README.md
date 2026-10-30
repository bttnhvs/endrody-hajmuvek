# Endrődy Hajművek – API

NestJS backend az Endrődy Hajművek weboldalához. Fogadja és elmenti a weboldal
ajánlatkéréseit, e-mailben értesíti a műhelyt (opcionálisan a vevőnek is visszaigazol),
és egy tokennel védett admin végponton listázza a megkereséseket.

## Indítás

```bash
npm install
cp .env.example .env     # Windowson: copy .env.example .env  – majd töltsd ki
npm run start:dev        # http://localhost:3001/api/health
npm test                 # unit tesztek
```

Node.js 20+ szükséges. Fejlesztéshez nem kell adatbázist telepíteni: az adatok a
`data/hajmuvek.sqlite` fájlba kerülnek. Élesben a `DATABASE_URL` beállításával PostgreSQL-re vált.

A frontend (`../frontend`) `npm start`-tal indítva automatikusan ide továbbítja az `/api` kéréseket.

## Végpontok

| Metódus | Útvonal | Védelem | Leírás |
|---|---|---|---|
| GET | `/api/health` | – | életjel |
| POST | `/api/inquiries` | rate limit (5 / 10 perc / IP) | új ajánlatkérés |
| GET | `/api/inquiries?status=uj` | `Authorization: Bearer <ADMIN_TOKEN>` | ajánlatkérések listája |
| PATCH | `/api/inquiries/:id/status` | `Authorization: Bearer <ADMIN_TOKEN>` | állapot: `uj` / `folyamatban` / `lezarva` |

Próbakérések: `api.http` (VS Code REST Client bővítménnyel).

## Technika

- NestJS 11, modulok: `InquiriesModule`, `MailModule`
- TypeORM – SQLite (sql.js) fejlesztéshez, PostgreSQL élesben
- `class-validator` DTO-k, globális `ValidationPipe` (whitelist), magyar hibaüzenetek
- `@nestjs/throttler` rate limiting, honeypot spamszűrés
- E-mail a Resend HTTP API-jával (SMTP nélkül), száraz mód kulcs nélkül, HTML-escape a felhasználói adatokra
- Token alapú admin guard időben állandó összehasonlítással
- Jest unit tesztek a service-ekhez, mockolt repository-val és levelezővel (`jest.mock('resend')`)

Részletes magyarázat: [TANULAS-BACKEND.md](TANULAS-BACKEND.md)
