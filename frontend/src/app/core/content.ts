import { Faq, GalleryItem, ProcessStep, SegmentInfo, WorkCategory } from './models';

/*
  Az oldal tartalma, típusosan.
  Szándékosan nem a HTML-be írjuk bele: így a szöveg egy helyen
  szerkeszthető, és később könnyű lecserélni egy CMS-re vagy API-ra
  (csak a ContentService-t kell átírni, a komponensek nem változnak).
*/

export const SEGMENTS: SegmentInfo[] = [
  {
    id: 'szinhaz',
    photoId: 'loknik',
    categories: ['karakter', 'arcszor'],
    path: '/szinhaz',
    title: 'Színháznak',
    heroTitle: 'Parókák, amik reflektorfényben is hihetők',
    audience: 'Jelmeztervezőknek, színházaknak, filmes és amatőr társulatoknak.',
    summary:
      'Korhű és karakterparókák tervezés alapján, gyors javítás és frissítés a meglévő parókaállományhoz.',
    offers: [
      'Új paróka a jelmezterv vagy korabeli források alapján',
      'Szakáll, bajusz és pajesz kézzel csomózott alapon',
      'Gyors csere, ha szereplőváltás van',
      'A meglévő parókaállomány javítása, mosása, újraformázása',
      'Karakterparókák bérlése iskolai és amatőr előadásokra',
    ],
    priceFrom: null,
  },
  {
    id: 'mindennapi',
    photoId: 'barna',
    categories: ['termeszetes'],
    path: '/mindennapi',
    title: 'Mindennapra',
    heroTitle: 'Paróka, amiről senki nem mondja meg, hogy paróka',
    audience: 'Akinek ritkul a haja, aki stílust váltana, vagy egyszerűen jól akarja érezni magát.',
    summary:
      'Természetes hatású parókák a saját arcformádra, hajszínedre és életmódodra szabva.',
    offers: [
      'Kézzel csomózott választék és hajvonal, ami természetesen mozog',
      'Emberi haj vagy jó minőségű műhaj, a viselési szokásaidhoz igazítva',
      'Levágás és formázás rajtad, a végleges frizurára',
      'Mosás, frissítés és javítás – akkor is, ha a parókát máshol vetted',
    ],
    priceFrom: null,
  },
  {
    id: 'hajpotlas',
    photoId: 'valasztek',
    categories: ['termeszetes'],
    path: '/hajpotlas',
    title: 'Hajvesztés esetén',
    heroTitle: 'Nyugodt, diszkrét segítség, amikor elveszíted a hajad',
    audience: 'Kemoterápia, alopécia vagy más egészségi ok miatt hajukat vesztőknek.',
    summary:
      'Diszkrét, nyugodt konzultáció, bőrbarát alapanyag és utógondozás – a kezelés alatt és után is.',
    offers: [
      'Négyszemközti konzultáció, igény szerint otthon vagy kórházban',
      'Már a hajhullás előtt felmérjük a régi frizurádat, hogy visszakaphasd',
      'Puha, szellőző alap az érzékeny fejbőrre',
      'Igazítás a kezelés alatt, és segítség, amikor visszanő a hajad',
    ],
    priceFrom: null,
  },
];

export const PROCESS: ProcessStep[] = [
  {
    title: 'Beszélgetés',
    text: 'Elmondod, mire lesz a paróka, és mit szeretnél. Megnézzük a hajtípust, színt és a hosszt.',
    duration: '30–45 perc',
  },
  {
    title: 'Méretvétel',
    text: 'Fejformát veszünk fel, hogy az alap pontosan illeszkedjen és ne csússzon.',
    duration: '20 perc',
  },
  {
    title: 'Csomózás és tresszelés',
    text: 'A hajszálakat egyenként csomózom a csipkealapba, vagy tresszelő kereten tincsekbe fűzöm – ettől lesz természetes a fejbőr és a választék.',
    duration: '2–6 hét',
  },
  {
    title: 'Próba és igazítás',
    text: 'Felpróbálod, utána levágom és formázom a végleges frizurát rajtad.',
    duration: '1 alkalom',
  },
  {
    title: 'Átadás és gondozás',
    text: 'Megmutatom, hogyan mosd és tárold. Igény szerint rendszeres frissítést is vállalok.',
    duration: 'folyamatos',
  },
];

export const CATEGORY_LABELS: Record<WorkCategory, string> = {
  karakter: 'Színpadi és karakterparókák',
  termeszetes: 'Természetes hatású parókák',
  arcszor: 'Szakáll és bajusz',
  muhely: 'A műhelyből',
};

/*
  A munkák – a sorrend számít: a főoldal az első néhányat mutatja.
  Új munka hozzáadása: kép a public/images/munkak mappába (max. ~1100 px),
  és egy új sor ide.
*/
export const GALLERY: GalleryItem[] = [
  { id: 'rokoko', title: 'Rokokó parókapár', category: 'karakter', caption: 'Púderszőke és ősz, apró csigákba csavarva', image: 'images/munkak/rokoko-parokapar.jpg', width: 1100, height: 825, alt: 'Két rokokó paróka fejformán: egy szőke és egy ősz, sűrű göndör fürtökkel' },
  { id: 'platina', title: 'Platinaszőke hullámok', category: 'karakter', caption: 'Ötvenes évekbeli felépítés, csipkés hajvonallal', image: 'images/munkak/platinaszoke-hullamok.jpg', width: 825, height: 1100, alt: 'Platinaszőke, hullámos vintage frizura oldalról, fejformán' },
  { id: 'vizhullam', title: 'Fekete vízhullám', category: 'karakter', caption: 'Húszas évekbeli finger wave frizura', image: 'images/munkak/fekete-vizhullam.jpg', width: 825, height: 1100, alt: 'Rövid fekete paróka vízhullámokkal a munkaasztalon' },
  { id: 'rozsaszin', title: 'Rózsaszín hullám', category: 'karakter', caption: 'Pasztell színátmenet, nagy hullámmal', image: 'images/munkak/rozsaszin-hullam.jpg', width: 658, height: 1100, alt: 'Halvány rózsaszín paróka egy nagy oldalsó hullámmal' },
  { id: 'osz', title: 'Ősz karakterparóka', category: 'karakter', caption: 'Idősítő paróka színpadra', image: 'images/munkak/osz-karakterparoka.jpg', width: 825, height: 1100, alt: 'Ősz, hosszú karakterparóka készülés közben a fejformán' },
  { id: 'loknik', title: 'Platinaszőke loknik', category: 'karakter', caption: 'Telt, vállig érő fürtök', image: 'images/munkak/platinaszoke-loknik.jpg', width: 916, height: 1100, alt: 'Platinaszőke, loknis paróka szemből' },
  { id: 'szakall', title: 'Telt szakáll', category: 'arcszor', caption: 'Kézzel csomózott, ősz szálakkal keverve', image: 'images/munkak/teli-szakall.jpg', width: 825, height: 1100, alt: 'Sűrű, őszülő szakáll a formán' },
  { id: 'hosszu-szakall', title: 'Hosszú szakáll', category: 'arcszor', caption: 'Karakterszerephez', image: 'images/munkak/hosszu-szakall.jpg', width: 717, height: 1100, alt: 'Hosszú, sötét szakáll fejformán' },
  { id: 'bajusz', title: 'Bajusz', category: 'arcszor', caption: 'Csipkealapra csomózva', image: 'images/munkak/bajusz.jpg', width: 1100, height: 825, alt: 'Sötétbarna kunkorodó bajusz csipkealapon' },
  { id: 'barna', title: 'Barna, csipkés hajvonallal', category: 'termeszetes', caption: 'Kézzel csomózott választék', image: 'images/munkak/barna-csipkes-hajvonal.jpg', width: 825, height: 1100, alt: 'Barna, egyenes paróka a fejformán, a hajvonal kijelölésével' },
  { id: 'valasztek', title: 'Természetes választék', category: 'termeszetes', caption: 'A fejbőrt utánzó alap', image: 'images/munkak/barna-valasztek.jpg', width: 816, height: 1100, alt: 'Barna paróka közelről, látható természetes választékkal' },
  { id: 'fekete', title: 'Hosszú fekete', category: 'termeszetes', caption: 'Egyenes, derékig érő', image: 'images/munkak/hosszu-fekete.jpg', width: 726, height: 1100, alt: 'Hosszú, egyenes fekete paróka hátulról' },
  { id: 'oldalvalasztek', title: 'Fekete, oldalválasztékkal', category: 'termeszetes', caption: 'Csipkés homlokvonal', image: 'images/munkak/fekete-oldalvalasztek.jpg', width: 825, height: 1100, alt: 'Fekete paróka oldalválasztékkal fejformán' },
  { id: 'szoke', title: 'Platinaszőke egyenes', category: 'termeszetes', caption: 'Vállon túl érő, csipkés eleje', image: 'images/munkak/platinaszoke-egyenes.jpg', width: 825, height: 1100, alt: 'Világosszőke, egyenes paróka szemből' },
  { id: 'gondor', title: 'Göndör barna', category: 'termeszetes', caption: 'Természetes göndör textúra', image: 'images/munkak/gondor-barna.jpg', width: 825, height: 1100, alt: 'Hosszú, göndör barna paróka a szabadban' },
  { id: 'hajvonal', title: 'Csomózott hajvonal', category: 'muhely', caption: 'Szálanként csomózva a csipkébe', image: 'images/munkak/fekete-csomozott-hajvonal.jpg', width: 825, height: 1100, alt: 'Kézzel csomózott fekete hajvonal közelről a fejformán' },
  { id: 'tresszeles', title: 'Tresszelés', category: 'muhely', caption: 'A haj tincsekbe fűzése a kereten', image: 'images/munkak/tresszeles.jpg', width: 1100, height: 825, alt: 'Hajszálak fűzése szálra a tresszelő kereten' },
  { id: 'tresszek', title: 'Kész tresszek', category: 'muhely', caption: 'Ezekből épül fel a paróka', image: 'images/munkak/tresszek.jpg', width: 825, height: 1100, alt: 'Feltekert, kész haj-tresszek' },
  { id: 'felepites', title: 'Felépítés közben', category: 'muhely', caption: 'A hullámok rögzítése a fejformán', image: 'images/munkak/platinaszoke-felepites.jpg', width: 910, height: 1100, alt: 'Platinaszőke paróka formázás közben, a hajvonal mentén tűzött szalaggal' },
];

export const FAQS: Faq[] = [
  {
    question: 'Mennyi idő alatt készül el egy paróka?',
    answer:
      'Egy teljesen kézzel csomózott paróka a hossztól és a sűrűségtől függően 2–6 hét. Sürgős színházi munkánál érdemes mielőbb jelezni, hogy beosszuk.',
    segments: ['szinhaz', 'mindennapi', 'hajpotlas'],
  },
  {
    question: 'Milyen hajból készülnek a parókák?',
    answer:
      'Emberi hajból vagy jó minőségű műhajból – a választás az ártól, a viselés gyakoriságától és a kívánt hatástól függ. A konzultáción mindkettőt megmutatom.',
    segments: ['mindennapi', 'hajpotlas'],
  },
  {
    question: 'Jár-e társadalombiztosítási támogatás a parókára?',
    answer:
      'Kemoterápia esetén az onkológus felírhat parókát, de a NEAK-támogatás csak a hivatalos listán szereplő modellekre vehető igénybe. Az egyedi munkák erről a listáról jellemzően hiányoznak – kérdezz rá, milyen kedvezménnyel tudok segíteni.',
    segments: ['hajpotlas'],
  },
  {
    question: 'El tudsz jönni hozzám?',
    answer: 'Igen, előre egyeztetett időpontban házhoz vagy kórházba is megyek konzultációra és próbára.',
    segments: ['hajpotlas'],
  },
  {
    question: 'Vállaltok javítást vagy átalakítást meglévő parókára?',
    answer:
      'Igen: mosás, újraformázás, csomózás javítása, színkorrekció. Színházaknak állományfrissítést is vállalok.',
    segments: ['szinhaz', 'mindennapi'],
  },
  {
    question: 'Lehet parókát bérelni?',
    answer:
      'Iskolai előadásra, farsangra vagy forgatásra a meglévő karakterparókáim közül bérelhetsz. Írd meg, mire és mikorra kellene.',
    segments: ['szinhaz'],
  },
];
