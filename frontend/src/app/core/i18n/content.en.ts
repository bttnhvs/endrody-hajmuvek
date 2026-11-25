import { CATEGORY_LABELS, FAQS, GALLERY, PROCESS, SEGMENTS } from '../content';
import { Faq, GalleryItem, ProcessStep, Segment, SegmentInfo, WorkCategory } from '../models';

/*
  A tartalom angol szövegei. Csak a szöveg van itt: a képek, méretek, kategóriák
  a magyar content.ts-ből jönnek, és összefésüljük őket.
  Új munka vagy GYIK felvételekor ide is írd be a fordítást; amíg nincs, a magyar szöveg látszik.
*/
type SegmentText = Pick<SegmentInfo, 'title' | 'heroTitle' | 'audience' | 'summary' | 'offers'>;

const SEGMENT_TEXT: Record<Segment, SegmentText> = {
  szinhaz: {
    title: 'For theatre',
    heroTitle: 'Wigs that convince under stage lights and on camera',
    audience: 'For costume designers, theatres, film productions and amateur companies.',
    summary:
      'Period and character wigs made to the costume design, facial hair, and repairs, alterations and restyling for your existing stock. I know what a wig has to survive over a season and what the camera sees up close.',
    offers: [
      'New wigs based on the costume design or period sources',
      'Beards, moustaches and sideburns made to order',
      'Alterations and resizing of existing wigs',
      'Repair, washing and restyling of your existing wig stock',
      'Film work: wigs and hairstyles made for the closeness of the camera',
    ],
  },
  mindennapi: {
    title: 'For every day',
    heroTitle: 'A wig nobody can tell is a wig',
    audience: 'For anyone with thinning hair, looking for a new style, or simply wanting to feel good.',
    summary:
      'Natural-looking wigs tailored to your face shape, hair colour and lifestyle. I can also alter, resize or restyle a wig you already have.',
    offers: [
      'A parting and hairline that move naturally',
      'Human hair or high-quality synthetic hair, matched to how you wear it',
      'Cut and styled on you into the final look',
      'Washing, refreshing and repairs, even if you bought the wig elsewhere',
    ],
  },
  styling: {
    title: 'Restyling and special occasions',
    heroTitle: 'A new look for the wig you already own',
    audience: 'For anyone who already has a wig and wants a new style, or is getting ready for a special occasion.',
    summary:
      'I restyle existing wigs, whether you want a completely new hairstyle or something for a special occasion. It does not matter if you bought the wig elsewhere.',
    offers: [
      'A completely new hairstyle for your existing wig',
      'Special-occasion styles for wigs and hairpieces',
      'Period hairstyles from the Rococo to the Victorian era',
      'Washing and restyling to make the wig look fresh again',
    ],
  },
};

const PROCESS_TEXT: ProcessStep[] = [
  { title: 'Conversation', text: 'You tell me what the wig is for and what you would like. We look at hair type, colour and length.', duration: '30–45 min' },
  { title: 'Measuring', text: 'We take the shape of your head so the base fits precisely and does not slip.', duration: '20 min' },
  { title: 'Knotting and wefting', text: 'I knot the hairs one by one into the lace base, or weave them into wefts on a frame. This is what makes a wig look natural.', duration: '2–6 weeks' },
  { title: 'Fitting and adjusting', text: 'You try it on, then I cut and style the final look on you.', duration: '1 session' },
  { title: 'Handover and care', text: 'I show you how to wash and store it. Regular refreshes are available if you need them.', duration: 'ongoing' },
];

const CATEGORY_TEXT: Record<WorkCategory, string> = {
  karakter: 'Stage and character wigs',
  termeszetes: 'Natural-looking wigs',
  arcszor: 'Beards and moustaches',
  muhely: 'From the workshop',
};

const GALLERY_TEXT: Record<string, Pick<GalleryItem, 'title' | 'caption' | 'alt'>> = {
  rokoko: { title: 'Pair of rococo wigs', caption: 'Powder blonde and grey, set in tiny curls', alt: 'Two rococo wigs on blocks: one blonde and one grey, with dense curls' },
  platina: { title: 'Platinum blonde waves', caption: 'Fifties-style set with a lace hairline', alt: 'Platinum blonde wavy vintage hairstyle from the side, on a block' },
  vizhullam: { title: 'Black finger waves', caption: 'Twenties finger wave hairstyle', alt: 'Short black wig with finger waves on the work table' },
  rozsaszin: { title: 'Pink wave', caption: 'Pastel colour fade with one large wave', alt: 'Pale pink wig with one large side wave' },
  osz: { title: 'Grey character wig', caption: 'Ageing wig for the stage', alt: 'Long grey character wig in progress on a block' },
  loknik: { title: 'Platinum blonde curls', caption: 'Full, shoulder-length curls', alt: 'Platinum blonde curly wig from the front' },
  szakall: { title: 'Full beard', caption: 'Hand-knotted, blended with grey', alt: 'Dense greying beard on a form' },
  'hosszu-szakall': { title: 'Long beard', caption: 'For a character role', alt: 'Long dark beard on a block' },
  bajusz: { title: 'Moustache', caption: 'Knotted on a lace base', alt: 'Dark brown curled moustache on a lace base' },
  barna: { title: 'Brown with lace hairline', caption: 'Hand-knotted parting', alt: 'Straight brown wig on a block with the hairline marked' },
  valasztek: { title: 'Natural parting', caption: 'A base that mimics the scalp', alt: 'Close-up of a brown wig showing a natural parting' },
  fekete: { title: 'Long black', caption: 'Straight, waist length', alt: 'Long straight black wig from behind' },
  oldalvalasztek: { title: 'Black with side parting', caption: 'Lace front hairline', alt: 'Black wig with a side parting on a block' },
  szoke: { title: 'Straight platinum blonde', caption: 'Past the shoulders, lace front', alt: 'Light blonde straight wig from the front' },
  gondor: { title: 'Curly brown', caption: 'Natural curly texture', alt: 'Long curly brown wig outdoors' },
  hajvonal: { title: 'Knotted hairline', caption: 'Knotted strand by strand into the lace', alt: 'Close-up of a hand-knotted black hairline on a block' },
  tresszeles: { title: 'Wefting', caption: 'Weaving hair into wefts on the frame', alt: 'Hair being woven onto threads on a wefting frame' },
  tresszek: { title: 'Finished wefts', caption: 'The building blocks of a wig', alt: 'Rolled, finished hair wefts' },
  felepites: { title: 'During the set', caption: 'Securing the waves on the block', alt: 'Platinum blonde wig being styled, with tape pinned along the hairline' },
};

/* A sorrend megegyezik a magyar FAQS tömbével. */
const FAQ_TEXT: Pick<Faq, 'question' | 'answer'>[] = [
  { question: 'How long does a wig take to make?', answer: 'A new wig takes 2–6 weeks, depending on the technique, length and density. For urgent theatre work, let me know as early as possible so I can schedule it.' },
  { question: 'What hair are the wigs made from?', answer: 'Human hair or high-quality synthetic hair. The choice depends on budget, how often you wear it and the look you want. I will show you both at the consultation.' },
  { question: 'How does the consultation work?', answer: 'The first consultation is online and free of charge. In-person consultations and fittings take place at my workshop in Szeged, by appointment, and are charged.' },
  { question: 'Do you repair or alter existing wigs?', answer: 'Yes: alterations, resizing, washing, restyling or even a completely new hairstyle, repairs to the knotting and colour correction. I also refresh wig stock for theatres.' },
  { question: 'Who have you worked for?', answer: 'I work regularly with theatres and companies, including Vígszínház, Örkény Theatre, Ferencváros Pinceszínház, Csiky Gergely Theatre in Kaposvár and the German State Theatre Timișoara, as well as on film sets. My film credits are on IMDb.' },
];

export const SEGMENTS_EN: SegmentInfo[] = SEGMENTS.map((s) => ({ ...s, ...SEGMENT_TEXT[s.id] }));
export const PROCESS_EN: ProcessStep[] = PROCESS.map((p, i) => PROCESS_TEXT[i] ?? p);
export const GALLERY_EN: GalleryItem[] = GALLERY.map((g) => ({ ...g, ...GALLERY_TEXT[g.id] }));
export const FAQS_EN: Faq[] = FAQS.map((f, i) => ({ ...f, ...FAQ_TEXT[i] }));
export const CATEGORY_LABELS_EN: typeof CATEGORY_LABELS = CATEGORY_TEXT;
