import { Routes } from '@angular/router';
import { EN_SLUGS } from './paths';

const segmentPage = () => import('../../pages/segment/segment-page').then((m) => m.SegmentPage);

/* Az angol oldalak: ugyanazok a komponensek, angol címmel és leírással. */
export const EN_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: '',
    data: {
      description:
        'Wigs, hairpieces, beards and moustaches for theatre, film and everyday life, plus alterations and restyling of existing wigs. Szeged and Budapest, Hungary.',
    },
    loadComponent: () => import('../../pages/home/home').then((m) => m.Home),
  },
  {
    path: EN_SLUGS['szinhaz'],
    title: 'Wigs for theatre and film',
    data: {
      segment: 'szinhaz',
      description:
        'Period and character wigs, beards and moustaches for theatre and film productions, plus repairs and alterations for your existing wig stock.',
    },
    loadComponent: segmentPage,
  },
  {
    path: EN_SLUGS['mindennapi'],
    title: 'Wigs for every day',
    data: {
      segment: 'mindennapi',
      description: 'Natural-looking wigs tailored to your face shape, plus alterations, resizing and restyling of wigs you already own.',
    },
    loadComponent: segmentPage,
  },
  {
    path: EN_SLUGS['styling'],
    title: 'Restyling and special occasions',
    data: {
      segment: 'styling',
      description: 'A new hairstyle for the wig you already own, plus special-occasion and period styling for wigs and hairpieces.',
    },
    loadComponent: segmentPage,
  },
  // A megszűnt hajpótlás-oldal régi címe (/en/hair-loss) a mindennapira visz (lásd app.routes.ts).
  { path: EN_SLUGS['hajpotlas'], redirectTo: EN_SLUGS['mindennapi'] },
  {
    path: EN_SLUGS['adatkezeles'],
    title: 'Privacy notice',
    data: { description: 'What personal data this website handles, why, for how long, and what your rights are.' },
    loadComponent: () => import('../../pages/privacy/privacy').then((m) => m.Privacy),
  },
  {
    path: EN_SLUGS['munkaim'],
    title: 'My work',
    data: { description: 'A selection of my theatre, film and everyday wigs and beards.' },
    loadComponent: () => import('../../pages/gallery/gallery').then((m) => m.Gallery),
  },
  {
    path: EN_SLUGS['ajanlatkeres'],
    title: 'Contact',
    data: { description: 'Request a consultation or a quote for a custom wig.' },
    loadComponent: () => import('../../pages/inquiry/inquiry').then((m) => m.InquiryPage),
  },
  {
    path: '**',
    title: 'Page not found',
    loadComponent: () => import('../../pages/not-found/not-found').then((m) => m.NotFound),
  },
];
