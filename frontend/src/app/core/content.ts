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
    inquiryType: 'szinhaz',
    title: 'Színháznak',
    heroTitle: 'Parókák, amik reflektorfényben és kamera előtt is hihetők',
    audience: 'Jelmeztervezőknek, színházaknak, filmes produkcióknak és amatőr társulatoknak.',
    summary:
      'Korhű és karakterparókák jelmezterv alapján, szakáll, bajusz, barkó, valamint a meglévő állomány javítása, átalakítása és újrafésülése. Tudom, mit kell kibírnia egy parókának egy évadon át, és mit lát belőle a kamera közelről.',
    offers: [
      'Új parókák a jelmezterv vagy korabeli források alapján',
      'Szakáll, bajusz és barkó egyedi megrendelésre',
      'Meglévő parókák átalakítása és méretre igazítása',
      'A meglévő állomány javítása, mosása és újrafésülése',
      'Filmes munka: parókák és frizurák a kamera közelségére',
    ],
    priceFrom: null,
  },
  {
    id: 'mindennapi',
    photoId: 'barna',
    categories: ['termeszetes'],
    path: '/mindennapi',
    inquiryType: 'mindennapi',
    title: 'Mindennapra',
    heroTitle: 'Paróka, amiről senki nem mondja meg, hogy paróka',
    audience: 'Akinek ritkul a haja, aki stílust váltana, vagy egyszerűen jól akarja érezni magát.',
    summary:
      'Természetes hatású parókák az arcformádra, hajszínedre és életmódodra szabva. A meglévő parókádat is átalakítom, méretre igazítom vagy új frizurát készítek rá.',
    offers: [
      'Természetesen mozgó választék és hajvonal',
      'Emberi haj vagy jó minőségű műhaj, a viselési szokásaidhoz igazítva',
      'Fazonra vágás és formázás',
      'Mosás, frissítés és javítás – akkor is, ha a parókát máshol vetted',
    ],
    priceFrom: null,
  },
  {
    id: 'styling',
    photoId: 'felepites',
    categories: ['karakter'],
    path: '/styling',
    inquiryType: 'egyeb',
    title: 'Styling és alkalmi frizurák',
    heroTitle: 'Új frizura a meglévő parókádra',
    audience: 'Akinek már van parókája, és új formát szeretne, vagy egy különleges alkalomra készül.',
    summary:
      'Meglévő parókát formázok újra, legyen szó egy teljesen új frizuráról vagy egy alkalmi, ünnepi változatról. Az sem baj, ha a parókát máshol vetted.',
    offers: [
      'Teljesen új frizura a meglévő parókádra',
      'Alkalmi és ünnepi frizurák parókára és pótrészre',
      'Korhű frizurák az ókori Egyiptomtól a 20. századig',
      'Mosás és újrafésülés, hogy a paróka újra friss legyen',
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
    text: 'Először a méreteid alapján megvarrom a montúrát, ami a paróka alapja. Ezután az igényekhez passzoló technikával bedolgozom a hajat.',
    duration: '2–6 hét',
  },
  {
    title: 'Próba és igazítás',
    text: 'Felpróbálod, és ha a méret stimmel, akkor már csak a fazonra vágás és a styling van hátra.',
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
      'Egy új paróka a technikától, a hossztól és a sűrűségtől függően 2–6 hét. Sürgős színházi munkánál érdemes mielőbb jelezni, hogy beosszuk.',
    segments: ['szinhaz', 'mindennapi'],
  },
  {
    question: 'Milyen hajból készülnek a parókák?',
    answer:
      'Emberi hajból vagy jó minőségű műhajból – a választás az ártól, a viselés gyakoriságától és a kívánt hatástól függ. A konzultáción mindkettőt megmutatom.',
    segments: ['mindennapi'],
  },
  {
    question: 'Hogyan tudunk egyeztetni?',
    answer:
      'Az első konzultáció online történik, és ingyenes. Személyes konzultációra és próbára a szegedi műhelyemben, előre egyeztetett időpontban, díj ellenében van lehetőség.',
    segments: ['szinhaz', 'mindennapi', 'styling'],
  },
  {
    question: 'Vállaltok javítást vagy átalakítást meglévő parókára?',
    answer:
      'Igen: átalakítás, méretre igazítás, mosás, újrafésülés vagy akár teljesen új frizura, a csomózás javítása és színkorrekció. Színházaknak állományfrissítést is vállalok.',
    segments: ['szinhaz', 'mindennapi', 'styling'],
  },
  {
    question: 'Kiknek dolgoztál eddig?',
    answer:
      'Rendszeresen dolgozom színházaknak és társulatoknak, többek között a Vígszínháznak, az Örkény István Színháznak, a Ferencvárosi Pinceszínháznak, a kaposvári Csiky Gergely Színháznak és a Temesvári Német Állami Színháznak, valamint filmforgatásokon is. A filmes munkáim az IMDb-n is megtalálhatók.',
    segments: ['szinhaz', 'mindennapi', 'styling'],
  },
];
