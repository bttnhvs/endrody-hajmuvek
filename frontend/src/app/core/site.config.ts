import { environment } from '../../environments/environment';

/*
  Az oldal "beállításai" – a barátnőddel együtt töltsétek ki!
  Minden, ami TODO-val van jelölve, helykitöltő.
*/
export const SITE = {
  name: 'Endrődy Hajművek',
  subtitle: 'Fodrászműhely',
  tagline: 'Kézzel készült parókák színpadra, filmre és hétköznapokra',
  city: 'Szeged · gyakran Budapesten',
  logo: 'images/logo.png',
  // TODO: valós elérhetőségek
  email: 'hello@endrodywigs.com',
  phone: '+36 30 000 0000',
  facebook: 'https://www.facebook.com/hajmuvek',
  instagram: 'https://www.instagram.com/hajmuvek/',
  imdb: 'https://www.imdb.com/name/nm9991615/bio/',
  // TODO: az Etsy-bolt címe, pl. 'https://www.etsy.com/shop/BoltNeve'.
  // Amíg üres, a menüben és a láblécben nincs link, a főoldali gomb az ajánlatkérésre visz.
  etsy: '',
  // TODO: a workshop-feliratkozás Formspree-azonosítója (a https://formspree.io/f/XXXX cím vége).
  // Saját űrlap kell ehhez az oldalhoz, hogy a feliratkozók a barátnődhöz kerüljenek.
  workshopFormspreeId: '',

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
    paragraphs: [
      'Fodrász és parókakészítő vagyok. A Szegedi Szabadtéri Játékokon a fodrász- és sminkrészleget vezetem, rendszeresen dolgozom színházaknak – többek között a Vámpírok bálja előadásain –, és filmforgatásokon is. A színpadon és a kamera előtt tanultam meg, mennyit számít egy szálanként csomózott hajvonal.',
      'A saját szegedi műhelyemben ugyanezzel a gondossággal készítem a mindennapi és a hajvesztés miatti parókákat is, és gyakran dolgozom Budapesten is. Az első beszélgetéstől az utolsó igazításig velem beszélsz.',
    ],
    /** Rövid címkék a szöveg alatt. TODO: igazítsátok a valósághoz. */
    tags: ['Fodrász', 'Színházi és filmes parókakészítő', 'Rokokó specialista', 'Kézi csomózás', 'Szeged', 'Budapest'],
    image: 'images/rolam-illusztracio.svg',
    imageAlt:
      'Illusztráció: rövid, vagány, szőke hajú parókakészítő a műhelyében, mellette egy barna, göndör paróka a fejformán',
    width: 400,
    height: 500,
  },

  /*
    A főoldal "Színházak, ahol dolgoztam" szekciója.
    Ha egy színháznál van `url`, megjelenik mellette a `linkLabel` szövegű link.
  */
  theatres: [
    { name: 'Szegedi Nemzeti Színház', url: '', linkLabel: '' },
    {
      name: 'Pinceszínház',
      url: 'https://pinceszinhaz.hu/a-tarsulat/',
      linkLabel: 'A társulat oldalán',
    },
    { name: 'Magyar Állami Operaház', url: '', linkLabel: '' },
    { name: 'Művészetek Palotája (Müpa)', url: '', linkLabel: '' },
  ],

  /* A főoldal Etsy-bolt szekciójának szövegei. */
  shop: {
    heading: 'Parókák és kiegészítők az Etsy-n',
    text: 'Cosplayhez vagy jelmezhez keresel valami különlegeset? Az Etsy-boltomban cosplay, rokokó és Vámpírok bálja stílusú parókákat és kiegészítőket találsz.',
    categories: [
      { title: 'Cosplay', text: 'Parókák és kiegészítők a kedvenc karaktereidhez.' },
      { title: 'Rokokó', text: 'Fürtös, díszes darabok a 18. század stílusában.' },
      { title: 'Vámpírok bálja stílus', text: 'A musical világát idéző parókák és kiegészítők.' },
    ],
  },

  /*
    Szakmai referenciák – a főoldal "Színpadon és filmen" sávja ezekből épül.
    TODO: ellenőrizzétek a pontos szerepeket, és írjátok be a linkeket
    (IMDb-profil, produkciók oldalai). Üres url = nincs link.
  */
  credits: [
    {
      where: 'Szegedi Szabadtéri Játékok',
      role: 'A fodrász- és sminkrészleg vezetője',
      url: '',
    },
    {
      where: 'Vámpírok bálja',
      role: 'Fodrász, parókák és frizurák',
      url: '',
    },
    {
      where: 'Szegedi Nemzeti Színház',
      role: 'A fodrásztár korábbi vezetője',
      url: '',
    },
    {
      where: 'Film és televízió',
      role: 'Fodrász és parókakészítő forgatásokon – a filmes munkák az IMDb-n',
      url: '', // TODO: IMDb-profil linkje
    },
  ],

  /*
    A saját NestJS backendünk címe – környezetenként más, ezért az
    environments mappából jön:
    - `ng serve`: '/api' (a proxy.conf.json továbbítja a localhost:3001-re)
    - `ng build`: a Renderen futó API teljes címe
  */
  apiUrl: environment.apiUrl,
} as const;
