import { SITE } from '../site.config';
import { Lang } from './paths';

/*
  Adatkezelési tájékoztató – mindkét nyelv egy fájlban, hogy együtt lehessen frissíteni őket.

  Ez sablon, nem jogi tanácsadás: élesítés előtt Juditnak (vagy egy jogásznak, könyvelőnek)
  át kell néznie. A [szögletes zárójeles] részeket ki kell tölteni, ezek az oldalon is így látszanak.
  Ha az oldal új adatot kezd gyűjteni vagy új szolgáltatót használ, ezt is frissíteni kell.
*/

export interface PrivacySection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

export interface PrivacyText {
  title: string;
  updated: string;
  intro: string;
  sections: PrivacySection[];
}

const contact = `${SITE.email}, ${SITE.phone}`;

const hu: PrivacyText = {
  title: 'Adatkezelési tájékoztató',
  updated: 'Hatályos: [dátum, pl. 2026. december 1.]',
  intro:
    'Ebben a tájékoztatóban leírom, milyen személyes adatokat kezelek, amikor használod ezt a weboldalt, mire használom őket, meddig őrzöm meg, és milyen jogaid vannak.',
  sections: [
    {
      title: '1. Ki kezeli az adataidat?',
      items: [
        'Adatkezelő: [név]',
        'Székhely: [cím]',
        'Adószám: [adószám]',
        `Elérhetőség: ${contact}`,
      ],
    },
    {
      title: '2. Ajánlatkérés és kapcsolatfelvétel',
      paragraphs: [
        'Ha kitöltöd az ajánlatkérő űrlapot, ezeket az adatokat kezelem: a neved, az e-mail-címed, a telefonszámod (ha megadod), az üzeneted, a kérés típusa és a beküldés időpontja.',
        'Cél: hogy válaszolni tudjak a megkeresésedre, ajánlatot adjak, és időpontot egyeztessünk. Az elküldött adatokat a Netlify tárolja, és e-mailben értesítést kapok róluk.',
        'Jogalap: a hozzájárulásod (GDPR 6. cikk (1) bekezdés a) pont), amit az űrlap elküldésekor adsz meg. Ha a megkeresésből megrendelés lesz, a szerződés előkészítése és teljesítése (GDPR 6. cikk (1) bekezdés b) pont).',
        'Megőrzés: [javaslat: a megkeresés lezárásától számított 1 évig], vagy addig, amíg vissza nem vonod a hozzájárulásodat. Ha megrendelés lesz belőle, a számviteli szabályok szerinti ideig.',
        'Kérlek, az üzenetben csak annyit írj, amennyi a munkához szükséges, és ne adj meg egészségügyi adatot.',
      ],
    },
    {
      title: '3. Értesítés a workshopokról',
      paragraphs: [
        'Ha feliratkozol a workshopokról és magánórákról szóló értesítésre, az e-mail-címedet, a hozzájárulásod tényét és az oldal nyelvét kezelem.',
        'Cél: hogy szóljak, amikor indulnak a workshopok és az órák. A feliratkozást a Netlify tárolja. Jogalap: a hozzájárulásod (GDPR 6. cikk (1) bekezdés a) pont).',
        'Megőrzés: amíg le nem iratkozol, vagy amíg vissza nem vonod a hozzájárulásodat. Leiratkozni bármikor lehet egy e-mailben.',
      ],
    },
    {
      title: '4. Technikai adatok és sütik',
      paragraphs: [
        'A weboldal nem használ sütiket, látogatottságmérést vagy hirdetési követést.',
        'A tárhelyszolgáltató a működéshez és a biztonsághoz szükséges szervernaplókat vezet (például IP-cím, időpont, böngésző típusa). Jogalap: jogos érdek a weboldal biztonságos működéséhez (GDPR 6. cikk (1) bekezdés f) pont). Ezeket a szolgáltató a saját szabályai szerint, rövid ideig őrzi.',
      ],
    },
    {
      title: '5. Kik férnek hozzá az adatokhoz?',
      paragraphs: [
        'Az adataidat nem adom el, és nem adom át senkinek marketingcélra. Az oldal működéséhez egyetlen szolgáltatót (adatfeldolgozót) használok, aki csak az én utasításaim szerint kezelheti az adatokat:',
      ],
      items: [
        'Netlify, Inc. (USA): a weboldal tárhelye, az űrlapokon beküldött adatok tárolása és az e-mail-értesítés',
      ],
    },
    {
      title: '6. Adattovábbítás az Európai Unión kívülre',
      paragraphs: [
        'A Netlify az Egyesült Államokban működik. Az adattovábbítás az EU–USA adatvédelmi keretrendszer alapján (ha a Netlify tanúsítvánnyal rendelkezik), vagy az Európai Bizottság által elfogadott általános szerződési feltételek alapján történik. [Élesítés előtt ellenőrizendő.]',
      ],
    },
    {
      title: '7. A jogaid',
      paragraphs: ['Bármikor kérheted:'],
      items: [
        'hogy tájékoztassalak, milyen adataidat kezelem (hozzáférés)',
        'a pontatlan adatok javítását (helyesbítés)',
        'az adataid törlését',
        'az adatkezelés korlátozását',
        'az adataid átadását géppel olvasható formában (adathordozhatóság)',
        'tiltakozást a jogos érdeken alapuló adatkezelés ellen',
        'a hozzájárulásod visszavonását: ez nem érinti a visszavonás előtti adatkezelés jogszerűségét',
      ],
    },
    {
      title: '8. Hogyan élhetsz a jogaiddal?',
      paragraphs: [
        `Írj nekem: ${SITE.email}. A kérésedre legkésőbb egy hónapon belül válaszolok.`,
        'Ha úgy érzed, hogy megsértettem a jogaidat, panaszt tehetsz a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH): 1055 Budapest, Falk Miksa utca 9–11., postacím: 1363 Budapest, Pf. 9., telefon: +36 1 391 1400, e-mail: ugyfelszolgalat@naih.hu, honlap: naih.hu. Bírósághoz is fordulhatsz; a pert a lakóhelyed szerinti törvényszék előtt is megindíthatod.',
      ],
    },
    {
      title: '9. Módosítás',
      paragraphs: ['Ha a tájékoztató változik, a frissített változatot ezen az oldalon teszem közzé.'],
    },
  ],
};

const en: PrivacyText = {
  title: 'Privacy notice',
  updated: 'Effective from: [date, e.g. 1 December 2026]',
  intro:
    'This notice explains what personal data I handle when you use this website, what I use it for, how long I keep it, and what your rights are.',
  sections: [
    {
      title: '1. Who is responsible for your data?',
      items: [
        'Controller: [name]',
        'Registered address: [address]',
        'Tax number: [tax number]',
        `Contact: ${contact}`,
      ],
    },
    {
      title: '2. Enquiries and contact',
      paragraphs: [
        'If you fill in the enquiry form, I handle the following data: your name, email address, phone number (if you give it), your message, the type of enquiry and the time it was sent.',
        'Purpose: to answer your enquiry, give you a quote and arrange an appointment. The data you send is stored by Netlify, and I receive an email notification about it.',
        'Legal basis: your consent (Article 6(1)(a) GDPR), which you give when you send the form. If the enquiry leads to an order, preparing and performing the contract (Article 6(1)(b) GDPR).',
        'Retention: [suggestion: 1 year after the enquiry is closed], or until you withdraw your consent. If it leads to an order, for as long as accounting rules require.',
        'Please only write what is needed for the work in your message, and do not share health information.',
      ],
    },
    {
      title: '3. Workshop notifications',
      paragraphs: [
        'If you sign up to be notified about workshops and private lessons, I handle your email address, the fact that you gave consent and the language of the page.',
        'Purpose: to let you know when workshops and lessons start. Your sign-up is stored by Netlify. Legal basis: your consent (Article 6(1)(a) GDPR).',
        'Retention: until you unsubscribe or withdraw your consent. You can unsubscribe at any time by email.',
      ],
    },
    {
      title: '4. Technical data and cookies',
      paragraphs: [
        'This website does not use cookies, analytics or advertising tracking.',
        'The hosting provider keeps server logs needed for operation and security (for example IP address, time and browser type). Legal basis: legitimate interest in running the website securely (Article 6(1)(f) GDPR). The provider keeps these for a short time under its own rules.',
      ],
    },
    {
      title: '5. Who has access to the data?',
      paragraphs: [
        'I do not sell your data or share it with anyone for marketing. The website uses a single service provider (processor), who may only handle the data on my instructions:',
      ],
      items: [
        'Netlify, Inc. (USA): website hosting, storing the data sent through the forms and email notifications',
      ],
    },
    {
      title: '6. Transfers outside the European Union',
      paragraphs: [
        'Netlify is based in the United States. Transfers take place under the EU–US Data Privacy Framework (where Netlify is certified) or the standard contractual clauses adopted by the European Commission. [To be checked before publishing.]',
      ],
    },
    {
      title: '7. Your rights',
      paragraphs: ['You can ask at any time:'],
      items: [
        'to be told what data I hold about you (access)',
        'to have inaccurate data corrected (rectification)',
        'to have your data deleted (erasure)',
        'to restrict the processing',
        'to receive your data in a machine-readable format (portability)',
        'to object to processing based on legitimate interest',
        'to withdraw your consent; this does not affect the lawfulness of processing before the withdrawal',
      ],
    },
    {
      title: '8. How to exercise your rights',
      paragraphs: [
        `Write to me at ${SITE.email}. I will reply within one month at the latest.`,
        'If you believe your rights have been infringed, you can lodge a complaint with the Hungarian National Authority for Data Protection and Freedom of Information (NAIH): 1055 Budapest, Falk Miksa utca 9–11., postal address: 1363 Budapest, Pf. 9., phone: +36 1 391 1400, email: ugyfelszolgalat@naih.hu, website: naih.hu. You can also go to court, including the regional court of your place of residence.',
      ],
    },
    {
      title: '9. Changes',
      paragraphs: ['If this notice changes, I will publish the updated version on this page.'],
    },
  ],
};

export const PRIVACY: Record<Lang, PrivacyText> = { hu, en };
