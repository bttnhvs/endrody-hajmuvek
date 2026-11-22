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
        'Hand-knotted wigs by the head of the hair and make-up department at the Szeged Open-Air Festival: for theatre, film, everyday wear and hair loss. Szeged and Budapest, Hungary.',
    },
    loadComponent: () => import('../../pages/home/home').then((m) => m.Home),
  },
  {
    path: EN_SLUGS['szinhaz'],
    title: 'Wigs for theatre and film',
    data: {
      segment: 'szinhaz',
      description:
        'Period and character wigs for theatre and film, wig stock repair and hire, by the head of the hair and make-up department at the Szeged Open-Air Festival.',
    },
    loadComponent: segmentPage,
  },
  {
    path: EN_SLUGS['mindennapi'],
    title: 'Wigs for every day',
    data: {
      segment: 'mindennapi',
      description: 'Natural-looking, hand-knotted wigs tailored to your face shape.',
    },
    loadComponent: segmentPage,
  },
  {
    path: EN_SLUGS['hajpotlas'],
    title: 'Wigs for hair loss',
    data: {
      segment: 'hajpotlas',
      description: 'Discreet consultation and skin-friendly wigs for chemotherapy or alopecia.',
    },
    loadComponent: segmentPage,
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
