import { Routes } from '@angular/router';
import { EN_ROUTES } from './core/i18n/en.routes';

/*
  Útvonalak.
  A `loadComponent` lusta betöltést (lazy loading) jelent: az adott oldal
  kódja csak akkor töltődik le, amikor valaki odanavigál. Így a főoldal
  gyorsabban jelenik meg – ez mobilon és a Google rangsorolásánál is számít.

  A három vevőkör-oldal ugyanazt a SegmentPage komponenst használja,
  csak más `data.segment` értékkel – nem írunk háromszor ugyanolyan kódot.
*/
export const routes: Routes = [
  // Az angol oldalak az /en alatt (lásd core/i18n/en.routes.ts).
  { path: 'en', children: EN_ROUTES },
  {
    path: '',
    title: '',
    data: {
      description:
        'Parókák, pótrészek, szakállak és bajuszok színházaknak, filmeknek és a mindennapokra, valamint meglévő parókák átalakítása és stylingja. Szeged és Budapest.',
    },
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'szinhaz',
    title: 'Parókák színházaknak',
    data: {
      segment: 'szinhaz',
      description: 'Korhű és karakterparókák, szakállak és bajuszok színházaknak és filmes produkcióknak, valamint a meglévő parókaállomány javítása és átalakítása.',
    },
    loadComponent: () => import('./pages/segment/segment-page').then((m) => m.SegmentPage),
  },
  {
    path: 'mindennapi',
    title: 'Parókák mindennapra',
    data: {
      segment: 'mindennapi',
      description: 'Természetes hatású parókák a saját arcformádra szabva, valamint meglévő parókák átalakítása, méretre igazítása és új frizurája.',
    },
    loadComponent: () => import('./pages/segment/segment-page').then((m) => m.SegmentPage),
  },
  {
    path: 'styling',
    title: 'Styling és alkalmi frizurák',
    data: {
      segment: 'styling',
      description: 'Új frizura a meglévő parókádra, valamint alkalmi és korhű frizurák parókára és pótrészre.',
    },
    loadComponent: () => import('./pages/segment/segment-page').then((m) => m.SegmentPage),
  },
  /*
    A hajpótlás-oldal megszűnt, de élesben futott, ezért lehetnek rá mutató linkek és
    Google-találatok. Az átirányítással ezek nem 404-es oldalra, hanem a Mindennapra oldalra visznek.
  */
  { path: 'hajpotlas', redirectTo: 'mindennapi' },
  {
    path: 'adatkezeles',
    title: 'Adatkezelési tájékoztató',
    data: { description: 'Milyen személyes adatokat kezel a weboldal, mire, meddig, és milyen jogaid vannak.' },
    loadComponent: () => import('./pages/privacy/privacy').then((m) => m.Privacy),
  },
  {
    path: 'munkaim',
    title: 'Munkáim',
    data: { description: 'Válogatás színházi, filmes és mindennapi parókáimból, szakállaimból.' },
    loadComponent: () => import('./pages/gallery/gallery').then((m) => m.Gallery),
  },
  {
    path: 'ajanlatkeres',
    title: 'Ajánlatkérés',
    data: { description: 'Kérj konzultációt vagy árajánlatot egyedi parókára.' },
    loadComponent: () => import('./pages/inquiry/inquiry').then((m) => m.InquiryPage),
  },
  {
    path: '**',
    title: 'Az oldal nem található',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
