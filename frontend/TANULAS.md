# Endrődy Hajművek – tanulási útmutató

Ez a fájl végigvezet a projekten: mit miért csináltam, és mit érdemes belőle megtanulni.
Javaslat: nyisd meg mellé VS Code-ban a hivatkozott fájlokat, és olvasd párhuzamosan.

---

## 0. Indítás

```bash
npm install      # letölti az Angulart és a többi függőséget (node_modules)
npm start        # = ng serve → http://localhost:4201
npm run build    # éles build a dist/ mappába
```

- Kell hozzá **Node.js 20.19+ vagy 22.12+** (`node -v`).
- VS Code: telepítsd az **Angular Language Service** bővítményt (a projekt fel is ajánlja,
  `.vscode/extensions.json`). Ettől lesz típusellenőrzés és automatikus kiegészítés a HTML sablonokban.
- A projekt Angular 20-ra van rögzítve. Ha a legújabbra akarsz frissíteni (érdemes, és jó gyakorlás):
  `npx ng update @angular/core @angular/cli` – a CLI automatikusan átírja, amit kell.

---

## 1. Mappaszerkezet

```
src/
  index.html            egyetlen HTML oldal; ebbe tölti be magát az Angular (<app-root>)
  main.ts               belépési pont
  styles.css            globális stílus + design tokenek (színek, betűk, térközök)
  app/
    app.ts              gyökérkomponens: fejléc + <router-outlet> + lábléc
    app.config.ts       globális beállítások (router, HTTP, nyelv, SEO)
    app.routes.ts       útvonalak (melyik URL melyik oldal)
    core/               "agy": típusok, adatok, szolgáltatások – nincs benne UI
      models.ts           TypeScript típusok
      site.config.ts      elérhetőségek, űrlap-végpont – EZT TÖLTSÉTEK KI
      content.ts          a szövegek és galéria adatai
      content.service.ts  innen kérik az adatot a komponensek
      inquiry.service.ts  az ajánlatkérés elküldése
      seo-title.strategy.ts  oldalcím + meta description route-onként
    shared/             újrahasznosítható UI-darabok (több oldal is használja)
    pages/              oldalak (mindegyik egy route)
public/
  images/logo.png       a logó (átlátszó háttérrel)
  images/munkak/        a munkák fotói, max. 1100 px-re kicsinyítve
```

**Miért így?** A `core` / `shared` / `pages` felosztás azt mutatja egy interjún, hogy
elválasztod az adatot és logikát a megjelenítéstől. Az új Angular stílus szerint
a fájlok neve `home.ts` (nem `home.component.ts`), az osztályé `Home`.

---

## 2. Hogyan indul el az alkalmazás?

1. `main.ts` → `bootstrapApplication(App, appConfig)`
2. `app.config.ts` regisztrálja a "providereket": router, HttpClient, magyar locale, saját TitleStrategy.
3. `App` kirajzolja a fejlécet, láblécet, és a `<router-outlet>`-be a router teszi az aktuális oldalt.

**Nincs NgModule.** Minden komponens *standalone*: a saját `imports` tömbjében sorolja fel,
mit használ (pl. `RouterLink`, egy másik komponens). Ha valamit elfelejtesz importálni,
a fordító szól.

---

## 3. Routing (`app.routes.ts`)

**Lazy loading:**
```ts
loadComponent: () => import('./pages/home/home').then((m) => m.Home)
```
Az oldal kódja csak akkor töltődik le, amikor odanavigálnak. Build után a `dist`-ben
látni fogod, hogy minden oldal külön "chunk".

**Egy komponens, három oldal:** a `/szinhaz`, `/mindennapi`, `/hajpotlas` ugyanazt a
`SegmentPage`-et tölti be, csak más `data.segment` értékkel. A `withComponentInputBinding()`
miatt ez az érték **közvetlenül a komponens `segment` inputjába** kerül:

```ts
readonly segment = input.required<Segment>();
```

Ugyanez működik query paraméterrel: `/ajanlatkeres?tipus=hajpotlas` → `InquiryPage.tipus`.
Nem kell `ActivatedRoute`-ot injektálni és feliratkozni.

**`title` és `data.description`:** ezeket a saját `SeoTitleStrategy` olvassa ki minden
navigációkor (lásd 8. pont).

---

## 4. Signalok – a modern Angular reaktivitás

Három fajta, mindhárom előfordul a kódban:

| | Mi ez | Példa a kódban |
|---|---|---|
| `signal()` | írható érték | `menuOpen` a fejlécben, `active` a galériában, `status` az űrlapon |
| `computed()` | másból származtatott, automatikusan frissül | `visible` és `filters` a galériában, `info`/`works` a SegmentPage-en |
| `input()` | komponens bemenet signalként | `WorkCard.item`, `WorkCard.priority`, `FaqList.faqs`, `SegmentPage.segment` |

Nézd meg a **`pages/gallery/gallery.ts`**-t: a szűrés teljes logikája két `computed`.
Ha kattintasz egy szűrőre (`active.set(...)`), a `visible` és a sablon magától frissül.
Nincs `subscribe`, nincs `ngOnChanges`, nincs kézi tömbmásolás.

Olvasás a sablonban: **meg kell hívni**, mint egy függvényt: `{{ menuOpen() }}`.

**Hol maradt RxJS?** Ahol eseményfolyam van: HTTP kérés (`InquiryService`) és router-események
(`SiteHeader`). Ökölszabály: *állapotra signal, eseményekre/aszinkron folyamra RxJS.*

`takeUntilDestroyed()` (a fejlécben): automatikusan leiratkozik, ha a komponens megszűnik.

---

## 5. Szolgáltatások és függőség-befecskendezés

```ts
@Injectable({ providedIn: 'root' })   // egy példány az egész appban
export class ContentService { ... }

private readonly content = inject(ContentService);  // konstruktor helyett
```

**Kategória ≠ vevőkör.** A munkák a paróka *típusa* szerint vannak címkézve
(`karakter`, `termeszetes`, `arcszor`, `muhely`), a vevőkörök pedig megmondják, melyik
típusok érdeklik őket (`SegmentInfo.categories`). Így egy természetes hatású paróka a
"Mindennapra" és a "Hajvesztés esetén" oldalon is megjelenik, duplikálás nélkül
(`ContentService.worksFor()`). Ez az adatmodellezés egyik alapkérdése: mi a valódi
tulajdonsága az adatnak, és mi csak egy nézőpont rá?

**Miért van `ContentService`, ha az adat egy sima fájlban van?** Mert a komponensek így nem
tudják, honnan jön az adat. Ha később egy CMS-ből (pl. Sanity, Contentful) vagy saját API-ból
töltöd, csak ezt az egy osztályt írod át. Ez egy interjúkérdésre is jó válasz ("hogyan
tervezel úgy, hogy később könnyű legyen változtatni?").

`NetlifyFormsService` – az űrlapokat a Netlify Formsnak küldi (`POST /__forms.html`,
`application/x-www-form-urlencoded`, `form-name` mezővel). A HTTP-hibákat itt fordítja le
emberi nyelvű üzenetté, így a komponens csak egy kész szöveget kap. Fejlesztés közben
(`isDevMode()`) nincs Netlify, ezért ott csak szimulálja a küldést.

---

## 6. Sablonok – az új vezérlő szintaxis

```html
@if (status() === 'sent') { ... } @else { ... }

@for (item of visible(); track item.id) { ... } @empty { ... }

@let s = info();     <!-- helyi változó a sablonban (segment-page.html) -->
```

- A `track` kötelező: ebből tudja az Angular, melyik DOM-elem melyik adathoz tartozik,
  így szűréskor nem rajzol újra mindent.
- A régi `*ngIf` / `*ngFor` még működik, de új kódba ezt használd.

---

## 7. Űrlap (`pages/inquiry/`)

**Típusos Reactive Forms** `NonNullableFormBuilder`-rel:

```ts
form = this.fb.group({
  type: this.fb.control<InquiryType>('mindennapi', Validators.required),
  email: ['', [Validators.required, Validators.email]],
  consent: [false, Validators.requiredTrue],
});
```

- `form.getRawValue()` típusa pontosan megegyezik az `Inquiry` interfésszel → a TS ellenőrzi.
- Hibaüzenet csak akkor jelenik meg, ha a mezőhöz már hozzányúltak **vagy** beküldték
  (`showError`). Így nem kiabál pirossal az üres űrlap betöltéskor.
- A küldés állapota egy signal: `idle → sending → sent / error`. A gomb `sending` alatt le van tiltva
  (nem lehet kétszer elküldeni).
- Hozzáférhetőség: minden mezőnek van `<label for>`, a hibás mező `aria-invalid`,
  a hibaüzenet `aria-describedby`-jal kapcsolódik.

**Honeypot (spamcsapda):** az űrlapban van egy rejtett `bot-field` mező. Ember nem látja és nem tölti ki,
a spamrobotok viszont igen – a Netlify az ilyen beküldéseket csendben eldobja
(`netlify-honeypot="bot-field"`). Captcha nélkül, a látogatót nem zavarva szűri ki a legtöbb spamet.

**Netlify Forms egy SPA-ban:** a Netlify kitelepítéskor a statikus HTML-ben keresi a
`data-netlify="true"` űrlapokat. Az Angular az űrlapokat JavaScriptből rajzolja ki, ezeket a Netlify
nem látja – ezért van egy rejtett, statikus másolatuk a `public/__forms.html`-ben, ugyanazokkal a
mezőnevekkel. Új mező felvételekor ott is fel kell venni.


---

## 7/b. Képek (`shared/work-card/work-card.ts`)

A fotókat az **`NgOptimizedImage`** direktíva (`ngSrc`) jeleníti meg:

```html
<img [ngSrc]="item().image" [width]="item().width" [height]="item().height" [priority]="priority()" />
```

- A `width`/`height` kötelező: ebből számolja a böngésző a helyet, mielőtt a kép letöltődik,
  így nem "ugrál" az oldal (ez a Lighthouse CLS mutatója).
- Alapból lusta betöltés; a `priority` a fold feletti képeket (hős, galéria első sora) előre veszi.
- Fejlesztés közben a konzolban figyelmeztet, ha egy kép jóval nagyobb, mint amekkorában látszik.

A képeket feltöltés előtt 1100 px-re kicsinyítettem és tömörítettem (az eredetik 2048 px-esek
voltak). Új munka: kép a `public/images/munkak/` mappába, és egy sor a `content.ts` `GALLERY`
tömbjébe – a méretet a kép tulajdonságaiból (jobb klikk → Tulajdonságok → Részletek) olvasd ki.

**Ív alakú képkeret** (`home.css` → `.arch`): `border-radius: 999px 999px 6px 6px` – a nagy
érték a felső sarkokat félkörré kerekíti. A mellette lévő zöld ív egy `::before` elem
félig átlátszó kerettel, ami a logó koszorújára utal.

---

## 7/c. "Rólam" blokk (`shared/about-maker/about-maker.ts`)

Egy komponens, két változat: a főoldalon teljes, a "Hajvesztés esetén" oldalon tömör.

```ts
readonly compact = input(false, { transform: booleanAttribute });
```
```html
<app-about-maker />          <!-- teljes -->
<app-about-maker compact />  <!-- tömör -->
```

A puszta `compact` attribútum értéke `''` (üres string) lenne. A beépített `booleanAttribute`
transform ezt `true`-vá alakítja, ugyanúgy, mint a natív HTML `disabled` attribútumnál.

A szöveg és a kép a `site.config.ts` → `about` alatt van. A kép most egy SVG illusztráció
(`public/images/rolam-illusztracio.svg`); valódi fotóra egy sor átírásával cserélhető.

---

## 8. SEO (`core/seo-title.strategy.ts`)

Az Angular gyári `TitleStrategy`-ját lecseréltük egy sajátra (`app.config.ts`):
```ts
{ provide: TitleStrategy, useClass: SeoTitleStrategy }
```
Ez a DI egyik legszebb tulajdonsága: egy beépített viselkedést a saját osztályoddal cserélsz le.
Minden oldalváltáskor beállítja a címet ("Parókák színházaknak – Endrődy Hajművek") és a meta descriptiont.

**Következő szint:** `ng add @angular/ssr` → prerendering. Ekkor minden oldal kész HTML-ként
kerül a szerverre, a Google azonnal látja a tartalmat, és az első betöltés is gyorsabb.

---

## 9. Stílus

- **Design tokenek** a `styles.css` `:root`-jában (`--mauve`, `--step-2`, `--gutter`...).
  Minden komponens ezeket használja → egy helyen tudod a teljes arculatot módosítani.
- **Komponens-stílusok elszigeteltek:** a `home.css` szabályai nem hatnak más oldalra
  (az Angular egyedi attribútumot ad minden elemnek, nézd meg DevToolsban!).
- Folyékony méretek `clamp()`-pel: a betűméret és térköz a képernyőhöz igazodik, töréspontok nélkül.
- Modern CSS, amit érdemes megnézni:
  - `:has(input:checked)` – a kijelölt rádiógomb kártyája kiemelődik, JS nélkül (`inquiry.css`)
  - `object-fit: cover` + `aspect-ratio` – eltérő méretű fotók egységes rácsban (`work-card.ts`)
  - CSS `counter` – a folyamat lépéseinek számozása (`process-steps.ts`)
  - `repeating-linear-gradient` – a hajminta, amíg nincsenek fotók
- `prefers-reduced-motion`: aki kikapcsolta az animációkat az oprendszerben, annak a hős-illusztráció
  tincse nem animál.

---

## 10. Hozzáférhetőség (a11y) – röviden

- "Ugrás a tartalomra" link (Tab-bal jelenik meg) – `app.ts`
- `aria-current="page"` az aktív menüponton (`ariaCurrentWhenActive`)
- `aria-expanded` a mobilmenü gombján, `aria-pressed` a galéria szűrőin
- GYIK natív `<details>/<summary>`-val: billentyűzettel és képernyőolvasóval is megy, **0 sor TS**
- Látható fókuszkeret mindenhol (`:focus-visible`)

Teszteld: Chrome DevTools → Lighthouse → Accessibility. Cél: 95+.

---

## 11. Gyakorló feladatok (ettől lesz igazán a tiéd a projekt)

Sorrendben, egyre nehezebbek:

1. **Töltsd ki a valós adatokat** – `site.config.ts`, `content.ts` (szövegek, elérhetőség).
2. **Pontosítsd a munkák címét és leírását** a `content.ts`-ben – a barátnőd tudja, melyik
   paróka melyik előadáshoz készült. A színházi referenciák (darab + színház neve) a legerősebb
   bizalomépítő elemek.
3. **Ár megjelenítése**: írj be egy `priceFrom` értéket – a `currency` pipe magyar formátumban mutatja.
4. **Próbáld ki a hibaágakat**: éles beállításokkal (`ng serve --configuration production`) a beküldés valódi kérést indít; a böngésző DevToolsában (Network → Offline) kipróbálhatod a "nem sikerült elérni" üzenetet.
5. **Galéria szűrő az URL-ben**: `/munkaim?kategoria=szinhaz` – tipp: `input()` + `withComponentInputBinding`,
   és a gombok `routerLink`-et kapjanak `[queryParams]`-szal.
6. **Tesztek**: `ContentService.faqsFor()`, a galéria `visible` computed-ja, az űrlap validációja.
7. **Prerender/SSR**: `ng add @angular/ssr`.
8. **Deploy**: Netlify, Vercel vagy Firebase Hosting – mindegyik ingyenes kis oldalra. Saját domain (pl. endrodywigs.com).
9. **Frissítés a legújabb Angularra** (`ng update`) és zoneless mód kipróbálása.

---

## 12. Hogyan mutasd be a portfóliódban?

A README-be és interjún:

- **Valódi ügyfél, valódi probléma**: egy kisvállalkozás piacbővítése (színház → mindennapi és
  egészségügyi vevőkör), az információs architektúra a három vevőkörre épül.
- **Modern Angular**: standalone komponensek, signalok (`signal`/`computed`/`input`),
  lazy loading, router input binding, típusos Reactive Forms, saját `TitleStrategy`.
- **Minőség**: Lighthouse-eredmények (tegyél be képernyőképet), hozzáférhetőség, mobilnézet.
- **Mérhető eredmény** (ha lesz): "az indulás óta X ajánlatkérés érkezett az oldalon keresztül".
  Ez erősebb minden technikai felsorolásnál.
