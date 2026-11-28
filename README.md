# Endrődy Hajművek – weboldal

Weboldal egy szegedi parókakészítő műhelynek: parókák, pótrészek és szőrzetek színházaknak,
filmeknek és a mindennapokra, valamint meglévő parókák átalakítása. Magyarul és angolul.

```
frontend/      Angular 20 – a weboldal
netlify.toml   Netlify build- és átirányítási beállítások
```

## Indítás

```bash
cd frontend
npm install
npm start          # http://localhost:4201
```

Node.js 20.19+ szükséges.

## Űrlapok

Az ajánlatkérő és a workshop-feliratkozás űrlapot a **Netlify Forms** fogadja, saját backend nélkül.
Mivel az oldal Angular SPA, az űrlapok rejtett statikus másolata a `frontend/public/__forms.html`-ben van:
ebből ismeri fel őket a Netlify kitelepítéskor. Fejlesztés közben (`npm start`) a küldés csak szimulált.

## Technika

Standalone komponensek, signalok, lazy loaded route-ok, típusos Reactive Forms, saját kétnyelvűség
külső csomag nélkül, `NgOptimizedImage`, saját `TitleStrategy` (SEO, hreflang), saját szerverről
kiszolgált betűtípusok, design tokenek, akadálymentesség.

## Dokumentáció

- [frontend/TANULAS.md](frontend/TANULAS.md) – a frontend felépítése lépésről lépésre
- [KITELEPITES.md](KITELEPITES.md) – kitelepítés és a Netlify beállításai
