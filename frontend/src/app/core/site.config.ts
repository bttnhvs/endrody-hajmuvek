import { environment } from '../../environments/environment';

/*
  Az oldal "beállításai" – a barátnőddel együtt töltsétek ki!
  Minden, ami TODO-val van jelölve, helykitöltő.
*/
export const SITE = {
  name: 'Endrődy Hajművek',
  subtitle: 'Fodrászműhely',
  tagline: 'Kézzel készült parókák',
  city: 'Budapest',
  logo: 'images/logo.png',
  // TODO: valós elérhetőségek
  email: 'hello@hajmuvek.hu',
  phone: '+36 30 000 0000',
  facebook: 'https://www.facebook.com/hajmuvek',
  instagram: '', // ha lesz, ide jöhet a link

  /*
    Támogatói tájékoztató – a Facebook-oldalon is szerepel, a weboldalon
    is látszania kell (a lábléc minden oldalon mutatja).
  */
  fundingNotice:
    'A vállalkozás létrehozását és fejlesztését a Vállalkozó Start II. Program keretében az OFA Nonprofit Kft. támogatta. A támogatás forrását a Nemzeti Foglalkoztatási Alap biztosította.',

  /*
    "Rólam" rész. TODO: a barátnőddel együtt írjátok át a saját hangján!
    A képet később cseréld valódi fotóra: tedd a public/images mappába
    (pl. rolam.jpg, álló formátum), és írd át az image/width/height mezőket.
  */
  about: {
    makerName: '', // TODO: pl. 'Endrődy Kata' – üresen hagyva nem jelenik meg
    heading: 'Aki a parókádat készíti',
    /** Kiemelt idézet a kép mellett – egy mondat, ami összefoglalja a hozzáállását. */
    quote: 'Egy paróka akkor jó, ha senki nem veszi észre, hogy paróka.',
    paragraphs: [
      'Fodrász vagyok, és évek óta készítek parókákat, szakállakat és bajuszokat színházi előadásokhoz. A színpadon tanultam meg, mennyit számít egy szálanként csomózott hajvonal.',
      'A saját műhelyemben ugyanezzel a gondossággal készítem a mindennapi és a hajvesztés miatti parókákat. Az első beszélgetéstől az utolsó igazításig velem beszélsz.',
    ],
    /** Rövid címkék a szöveg alatt. TODO: igazítsátok a valósághoz. */
    tags: ['Fodrász', 'Színházi parókakészítő', 'Kézi csomózás', 'Budapest'],
    image: 'images/rolam-illusztracio.svg',
    imageAlt:
      'Illusztráció: rövid, vagány, szőke hajú parókakészítő a műhelyében, mellette egy barna, göndör paróka a fejformán',
    width: 400,
    height: 500,
  },

  /*
    A saját NestJS backendünk címe – környezetenként más, ezért az
    environments mappából jön:
    - `ng serve`: '/api' (a proxy.conf.json továbbítja a localhost:3001-re)
    - `ng build`: a Renderen futó API teljes címe
  */
  apiUrl: environment.apiUrl,
} as const;
