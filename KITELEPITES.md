# Kitelepítés – lépésről lépésre

Három ingyenes szolgáltatás, mindegyik a GitHub-repóból dolgozik:

```
Látogató ──► Netlify (Angular, frontend/)  ──HTTPS──►  Render (NestJS, backend/)  ──►  Neon (PostgreSQL)
                                                              └──► Resend (e-mail értesítés)
```

Az előkészített fájlok:

| Fájl | Mire való |
|---|---|
| `netlify.toml` | a frontend buildje, SPA-átirányítás (`/admin` frissítéskor se adjon 404-et), fejlécek |
| `render.yaml` | a backend leírása („Blueprint”): build, indítás, health check, környezeti változók |
| `frontend/src/environments/` | az API címe: fejlesztéskor `/api`, élesben a Render-cím |

Becsült idő: kb. 1 óra, ha minden elsőre megy.

---

## 0. GitHub-repó

A Render és a Netlify is GitHubról építkezik, ezért először fel kell tölteni a projektet.

```bash
cd endrody-hajmuvek
git init
git add .
git status          # ELLENŐRIZD: a .env és a backend/data/ NEM szerepelhet a listában!
git commit -m "Első verzió"
```

Ezután a GitHubon hozz létre egy új repót (lehet privát is), és kövesd az ott megjelenő
`git remote add origin ...` + `git push -u origin main` utasításokat.

## 1. Adatbázis – Neon

1. Regisztráció: [neon.tech](https://neon.tech) → **Create project** (régió: Frankfurt).
2. A Dashboardon a **Connection string**-et másold ki (`postgresql://...` kezdetű).
   Ez lesz a `DATABASE_URL`. Titok, ne tedd a kódba!

A táblát a backend első indításkor magától létrehozza (`DB_SYNC=true`).

## 2. E-mail – Resend

1. Regisztráció: [resend.com](https://resend.com) **a barátnőd e-mail-címével**
   (domain nélkül csak a fiók saját címére lehet küldeni).
2. **API Keys → Create API Key** → a `re_` kezdetű kulcs a `RESEND_API_KEY`.

## 3. Backend – Render

1. Regisztráció: [render.com](https://render.com) GitHub-fiókkal.
2. **New → Blueprint** → válaszd ki a repót. A Render megtalálja a `render.yaml`-t.
3. Kitöltendő értékek (a többit a fájl beállítja):

   | Változó | Érték |
   |---|---|
   | `DATABASE_URL` | a Neon connection string |
   | `CORS_ORIGIN` | egyelőre `https://example.com` – a 5. lépésben átírod a Netlify-címre |
   | `RESEND_API_KEY` | a Resend kulcs |
   | `MAIL_TO` | a barátnőd e-mail-címe (amivel a Resendbe regisztrált) |

4. **Apply**. Az első build pár perc. Ha kész, nyisd meg:
   `https://hajmuvek-api.onrender.com/api/health` → `{"status":"ok",...}`
5. **Ha a Render más címet adott** (pl. foglalt volt a név), írd át a
   `frontend/src/environments/environment.ts` fájlban az `apiUrl`-t, és pushold.
6. Az **ADMIN_TOKEN**-t a Render generálta: a szolgáltatás **Environment** fülén tudod kimásolni.
   Ezzel kell belépni a `/admin` oldalon. Add át a barátnődnek biztonságos módon
   (pl. személyesen, ne e-mailben), és mentse el a böngésző jelszókezelőjébe.

## 4. Frontend – Netlify

1. Regisztráció: [netlify.com](https://netlify.com) GitHub-fiókkal.
2. **Add new site → Import an existing project → GitHub** → a repó.
   A beállításokat a `netlify.toml`-ból olvassa, semmit nem kell átírni → **Deploy**.
3. **Site configuration → Change site name**: pl. `endrody-hajmuvek`
   → a cím `https://endrody-hajmuvek.netlify.app` lesz.

## 5. Összekötés (CORS)

A böngésző csak akkor engedi, hogy a Netlify-oldal hívja a Render-API-t, ha az API ezt megengedi.

Render → a szolgáltatás → **Environment** → `CORS_ORIGIN` = a Netlify-cím pontosan,
perjel nélkül a végén: `https://endrody-hajmuvek.netlify.app` → **Save** (újraindul).

## 6. Próba

1. Nyisd meg a Netlify-oldalt, küldj egy ajánlatkérést.
   Az első küldés lassú lehet (alvó szerver) – ilyenkor megjelenik a „Még dolgozom rajta” üzenet.
2. Megjött az értesítő e-mail a `MAIL_TO` címre? (Ha nem: Render → **Logs**, ott látszik a Resend hibája.)
3. `https://endrody-hajmuvek.netlify.app/admin` → belépés az ADMIN_TOKEN-nel → látszik az üzenet?
4. Állítsd át „Folyamatban”-ra, frissítsd az oldalt → megmaradt?
5. A tesztüzenetet a végén állítsd „Lezárva” állapotba.

---

## Ha valami nem megy

| Tünet | Valószínű ok |
|---|---|
| Az űrlap: „Nem sikerült elérni a szervert” | `CORS_ORIGIN` nem pontosan a Netlify-cím (https, perjel nélkül), vagy rossz `apiUrl` |
| `/admin` frissítéskor 404 | a `netlify.toml` nem a repó gyökerében van |
| Render build hiba: `nest: not found` | be van állítva `NODE_ENV=production` → töröld (a build a devDependencies-t is igényli) |
| Render: `password authentication failed` | hibás `DATABASE_URL` – másold ki újra a Neonból |
| Nem jön e-mail, a logban `validation_error` | domain nélkül csak a Resend-fiók saját címére lehet küldeni – egyezzen a `MAIL_TO`-val |

## Később

- **Saját domain** (`hajmuvek.hu`): Netlify → Domain management; Resendben a domain hitelesítése,
  utána `MAIL_FROM="Endrődy Hajművek <hello@hajmuvek.hu>"` és bekapcsolható a
  `MAIL_CONFIRM_TO_CUSTOMER=true`. A `CORS_ORIGIN`-be ilyenkor az új címet is fel kell venni
  (vesszővel elválasztva több is megadható).
- **Migrációk**: ha már valódi adatok vannak, `DB_SYNC=false` és TypeORM migrációk
  (lásd `backend/TANULAS-BACKEND.md`).
