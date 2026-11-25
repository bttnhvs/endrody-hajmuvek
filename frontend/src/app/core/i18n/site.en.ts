import { SITE } from '../site.config';

/** A site.config nyelvfüggő része. A magyar SITE és az angol SITE_EN is ilyen alakú. */
export interface SiteText {
  name: string;
  subtitle: string;
  tagline: string;
  city: string;
  about: {
    makerName: string;
    heading: string;
    paragraphs: readonly string[];
    tags: readonly string[];
    image: string;
    imageAlt: string;
    width: number;
    height: number;
  };
  theatres: readonly { name: string; url: string; linkLabel: string }[];
  shop: {
    heading: string;
    text: string;
    categories: readonly { title: string; text: string }[];
  };
  credits: readonly {
    where: string;
    role: string;
    url: string;
    link?: { label: string; url: string };
  }[];
}

/* A linkek és képek a magyar SITE-ból jönnek, így csak egy helyen kell őket átírni. */
export const SITE_EN: SiteText = {
  name: 'Endrődy Wigs',
  subtitle: 'Hair & Wig Studio',
  tagline: 'Handmade wigs for stage, screen and everyday life',
  city: 'Szeged · often in Budapest',
  about: {
    ...SITE.about,
    heading: 'The person making your wig',
    paragraphs: [
      'I am a hairdresser and wigmaker. I lead the hair and make-up department of the Szeged Open-Air Festival, and I work regularly for theatres and on film sets.',
      'In my own workshop in Szeged I make new wigs and facial hair, and I alter, resize and restyle existing pieces. I often work in Budapest too. From the first conversation to the final fitting, you will be talking to me.',
    ],
    tags: ['Hairdresser', 'Key hairstylist', 'Hair designer', 'Theatre and film wigmaker', 'Rococo specialist', 'Wig alterations', 'Szeged', 'Budapest'],
    imageAlt:
      'Illustration: a wigmaker with short blonde hair in her workshop, next to a curly brown wig on a block',
  },
  // A sorrend megegyezik a magyar SITE.theatres listával, a linkek onnan jönnek.
  theatres: [
    'German State Theatre Timișoara',
    'Budapest Festival Orchestra',
    'Szeged Contemporary Dance Company',
    'Northern Theatre Satu Mare',
    'Csiky Gergely Theatre, Kaposvár',
    'Vígszínház (Comedy Theatre of Budapest)',
    'Örkény Theatre',
    'Ferencváros Pinceszínház',
    'Szeged National Theatre',
    'Hungarian State Opera',
  ].map((name, i) => ({
    name,
    url: SITE.theatres[i].url,
    linkLabel: SITE.theatres[i].url ? 'See the company page' : '',
  })),
  shop: {
    heading: 'Wigs and accessories on Etsy',
    text: 'Looking for something special for a historical or fantasy costume? My Etsy shop offers handmade wigs and accessories in both styles.',
    categories: [
      { title: 'Historical', text: 'Period hairstyles from the Rococo to the Victorian era.' },
      { title: 'Fantasy', text: 'Wigs and accessories for fantasy and fairy-tale costumes.' },
    ],
  },
  credits: [
    { where: 'Szeged Open-Air Festival', role: 'Head of the hair and make-up department', url: SITE.credits[0].url },
    { where: 'Budapest theatre productions', role: 'Key hairstylist, hair designer', url: SITE.credits[1].url },
    { where: 'Szeged National Theatre', role: 'Former head of the hair department', url: SITE.credits[2].url },
    {
      where: 'Film and television',
      role: 'Key hairstylist',
      url: SITE.credits[3].url,
      link: { label: 'film credits on IMDb', url: SITE.imdb },
    },
  ],
};
