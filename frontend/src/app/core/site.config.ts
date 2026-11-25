import { environment } from '../../environments/environment';

const IMDB_URL = 'https://www.imdb.com/name/nm9991615/bio/';

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
  imdb: IMDB_URL,
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
      'Fodrász és parókakészítő vagyok. A Szegedi Szabadtéri Játékokon a fodrász- és sminkrészleget vezetem, és rendszeresen dolgozom színházaknak és filmforgatásokon is.',
      'A szegedi műhelyemben új parókákat és szőrzeteket készítek, és meglévő darabokat alakítok át, igazítok méretre és formázok újra. Gyakran dolgozom Budapesten is. Az első beszélgetéstől az utolsó igazításig velem beszélsz.',
    ],
    /** Rövid címkék a szöveg alatt. TODO: igazítsátok a valósághoz. */
    tags: ['Fodrász', 'Key hairstylist', 'Hair designer', 'Színházi és filmes parókakészítő', 'Rokokó specialista', 'Parókaátalakítás', 'Szeged', 'Budapest'],
    image: 'images/rolam-illusztracio.svg',
    imageAlt:
      'Illusztráció: rövid, vagány, szőke hajú parókakészítő a műhelyében, mellette egy barna, göndör paróka a fejformán',
    width: 400,
    height: 500,
  },

  /*
    A főoldal "Színházak és társulatok, akikkel dolgoztam" szekciója.
    Ha egy elemnél van `url`, megjelenik alatta a `linkLabel` szövegű link.
    A sorrend az angol listában (site.en.ts) is ugyanez legyen.
    A Szegedi Nemzeti Színház marad. TODO: az Operaházról Judit még nem nyilatkozott.
  */
  theatres: [
    { name: 'Temesvári Német Állami Színház', url: '', linkLabel: '' },
    { name: 'Budapesti Fesztiválzenekar', url: '', linkLabel: '' },
    { name: 'Szegedi Kortárs Balett', url: '', linkLabel: '' },
    { name: 'Szatmárnémeti Északi Színház', url: '', linkLabel: '' },
    { name: 'Csiky Gergely Színház, Kaposvár', url: '', linkLabel: '' },
    { name: 'Vígszínház', url: '', linkLabel: '' },
    { name: 'Örkény István Színház', url: '', linkLabel: '' },
    { name: 'Ferencvárosi Pinceszínház', url: 'https://pinceszinhaz.hu/a-tarsulat/', linkLabel: 'A társulat oldalán' },
    { name: 'Szegedi Nemzeti Színház', url: '', linkLabel: '' },
    { name: 'Magyar Állami Operaház', url: '', linkLabel: '' },
  ],

  /* A főoldal Etsy-bolt szekciójának szövegei. */
  shop: {
    heading: 'Parókák és kiegészítők az Etsy-n',
    text: 'Történelmi vagy fantasy jelmezhez keresel valami különlegeset? Az Etsy-boltomban mindkét stílusban találsz kézzel készített parókákat és kiegészítőket.',
    categories: [
      { title: 'Történelmi', text: 'Korhű frizurák a rokokótól a viktoriánus korig.' },
      { title: 'Fantasy', text: 'Parókák és kiegészítők fantasy és mesebeli jelmezekhez.' },
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
      where: 'Budapesti színházi produkciók',
      role: 'Key hairstylist, hair designer',
      url: '',
    },
    {
      where: 'Szegedi Nemzeti Színház',
      role: 'A fodrásztár korábbi vezetője',
      url: '',
    },
    {
      where: 'Film és televízió',
      role: 'Key hairstylist',
      url: '',
      // A szerep után megjelenő link (a `url` ezzel szemben a cím egészét teszi linkké).
      link: { label: 'a filmes munkák az IMDb-n', url: IMDB_URL },
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
