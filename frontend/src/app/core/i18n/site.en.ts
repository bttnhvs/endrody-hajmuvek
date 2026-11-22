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
      'I am a hairdresser and wigmaker. I lead the hair and make-up department of the Szeged Open-Air Festival, work regularly for theatres, including productions of Dance of the Vampires, and on film sets. Stage and screen taught me how much a hand-knotted hairline matters.',
      'In my own workshop in Szeged, I bring the same care to everyday wigs and wigs for hair loss, and I often work in Budapest too. From the first conversation to the final fitting, you will be talking to me.',
    ],
    tags: ['Hairdresser', 'Key hairstylist', 'Hair designer', 'Theatre and film wigmaker', 'Rococo specialist', 'Hand-knotting', 'Szeged', 'Budapest'],
    imageAlt:
      'Illustration: a wigmaker with short blonde hair in her workshop, next to a curly brown wig on a block',
  },
  theatres: [
    { name: 'Szeged National Theatre', url: SITE.theatres[0].url, linkLabel: '' },
    { name: 'Pinceszínház', url: SITE.theatres[1].url, linkLabel: 'See the company page' },
    { name: 'Hungarian State Opera', url: SITE.theatres[2].url, linkLabel: '' },
    { name: 'Müpa Budapest – Palace of Arts', url: SITE.theatres[3].url, linkLabel: '' },
  ],
  shop: {
    heading: 'Wigs and accessories on Etsy',
    text: 'Looking for something special for cosplay or a costume? My Etsy shop offers cosplay, rococo and Dance of the Vampires-style wigs and accessories.',
    categories: [
      { title: 'Cosplay', text: 'Wigs and accessories for your favourite characters.' },
      { title: 'Rococo', text: 'Curled, ornate pieces in the style of the 18th century.' },
      { title: 'Dance of the Vampires style', text: 'Wigs and accessories inspired by the world of the musical.' },
    ],
  },
  credits: [
    { where: 'Szeged Open-Air Festival', role: 'Head of the hair and make-up department', url: SITE.credits[0].url },
    { where: 'Dance of the Vampires', role: 'Key hairstylist, hair designer', url: SITE.credits[1].url },
    { where: 'Szeged National Theatre', role: 'Former head of the hair department', url: SITE.credits[2].url },
    {
      where: 'Film and television',
      role: 'Key hairstylist',
      url: SITE.credits[3].url,
      link: { label: 'film credits on IMDb', url: SITE.imdb },
    },
  ],
};
