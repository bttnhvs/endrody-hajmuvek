# Endrődy Hajművek – weboldal

Full-stack weboldal egy budapesti parókakészítő műhelynek, amely színházi parókák mellett
mindennapi viseletre és hajvesztés esetére is készít egyedi, kézzel csomózott parókákat.

```
frontend/   Angular 20 – a weboldal, ami a látogató böngészőjében fut
backend/    NestJS 11 – API: ajánlatkérések fogadása, mentése, e-mail értesítés
```

## Indítás (két terminálban)

```bash
# 1. backend  →  http://localhost:3001/api/health
cd backend
npm install
copy .env.example .env        # macOS/Linux: cp .env.example .env
npm run start:dev

# 2. frontend  →  http://localhost:4201
cd frontend
npm install
npm start
```

Node.js 20.19+ szükséges. A frontend fejlesztés közben az `/api` kéréseket a
`proxy.conf.json` alapján a backendnek továbbítja.

VS Code-ban nyisd meg a `endrody-hajmuvek.code-workspace` fájlt: egyszerre mutatja mindkét projektet.

## Miért két külön projekt?

A frontend statikus fájlokká fordul, és bármilyen egyszerű tárhely kiszolgálja.
A backend egy szerveren fut, ő fér hozzá az adatbázishoz és a titkos beállításokhoz
(admin token, SMTP-jelszó), amik soha nem kerülhetnek a böngészőbe. Külön függőségeik
vannak, és egymástól függetlenül telepíthetők ki.

## Technika

**Frontend:** standalone komponensek, signalok, lazy loaded route-ok, típusos Reactive Forms,
`NgOptimizedImage`, saját `TitleStrategy` (SEO), design tokenek, akadálymentesség.

**Backend:** NestJS modulok és DI, `class-validator` DTO-k, TypeORM (SQLite fejlesztéshez,
PostgreSQL élesben), rate limiting, honeypot spamszűrés, Nodemailer, tokenes admin guard,
Jest unit tesztek.

## Dokumentáció

- [frontend/TANULAS.md](frontend/TANULAS.md) – a frontend felépítése lépésről lépésre
- [backend/TANULAS-BACKEND.md](backend/TANULAS-BACKEND.md) – a backend, Angular ↔ NestJS szótárral
