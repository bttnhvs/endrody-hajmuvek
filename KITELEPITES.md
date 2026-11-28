# Kitelepítés – Netlify

Az oldal egyetlen szolgáltatón fut: a **Netlify** szolgálja ki a weboldalt, és fogadja az űrlapokat
(Netlify Forms). A GitHub `main` ágára feltöltött változások automatikusan élesednek.

```
Látogató ──► Netlify (Angular, frontend/)  ──►  Netlify Forms (ajánlatkérés, workshop-feliratkozás)
                                                     └──► e-mail-értesítés Juditnak
```

| Fájl | Mire való |
|---|---|
| `netlify.toml` | a frontend buildje, SPA-átirányítás, biztonsági fejlécek |
| `frontend/public/__forms.html` | az űrlapok rejtett statikus másolata – ebből ismeri fel őket a Netlify |
| `frontend/src/app/core/netlify-forms.service.ts` | a beküldés a böngészőből |

## Egyszeri beállítás a Netlify felületén

1. **Űrlapfelismerés bekapcsolása:** a projekt → **Forms** → **Enable form detection**.
2. **Új kitelepítés:** **Deploys** → **Trigger deploy** → **Deploy site**. A Netlify csak kitelepítéskor
   keresi meg az űrlapokat, ezért a bekapcsolás után egyszer újra kell építeni.
3. **Ellenőrzés:** **Forms** alatt meg kell jelennie két űrlapnak: `ajanlatkeres` és `workshop`.
4. **E-mail-értesítés:** **Site configuration** → **Notifications** → **Emails and webhooks** →
   **Form submission notifications** → **Add notification** → **Email notification**.
   Űrlapnak válaszd az `ajanlatkeres`-t, címzettnek Judit e-mail-címét. Ugyanígy a `workshop`-hoz is.
5. **Spamszűrés:** a honeypot (`bot-field`) magától működik, és a Netlify a beküldéseket a saját
   spamszűrőjén is átfuttatja. A kiszűrtek a **Forms** → az űrlap → **Spam** fül alatt látszanak.

## Fejlesztés alatti mód

A `frontend/src/app/core/site.config.ts`-ben az `underConstruction: true` felső sávot és `noindex`
jelölést tesz az oldalra. Élesítéskor írd `false`-ra, és töltsd fel újra.

## Saját domain (endrodywigs.com)

Netlify → **Domain management** → **Add a domain**, majd a domain-szolgáltatónál a Netlify által
megadott DNS-beállítások. A linkelőnézeti kép címét (`frontend/src/index.html`, `og:image` és
`twitter:image`) ezután írd át az új domainre.

## Ha valami nem megy

| Tünet | Valószínű ok |
|---|---|
| Az űrlap hibát ír küldéskor | nincs bekapcsolva a form-észlelés, vagy utána nem volt új kitelepítés |
| A **Forms** alatt nem látszik az űrlap | a `__forms.html` nem került ki (ellenőrizd: `/__forms.html` megnyitható-e) |
| Egy mező üresen érkezik | a mező hiányzik a `__forms.html`-ből – ott is fel kell venni ugyanazzal a névvel |
| Nem jön e-mail | nincs beállítva értesítés (4. lépés), vagy a levél a spam mappába került |
