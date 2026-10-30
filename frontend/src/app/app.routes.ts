import { Routes } from '@angular/router';
import { adminGuard } from './core/admin/admin.guard';

/*
  Útvonalak.
  A `loadComponent` lusta betöltést (lazy loading) jelent: az adott oldal
  kódja csak akkor töltődik le, amikor valaki odanavigál. Így a főoldal
  gyorsabban jelenik meg – ez mobilon és a Google rangsorolásánál is számít.

  A három vevőkör-oldal ugyanazt a SegmentPage komponenst használja,
  csak más `data.segment` értékkel – nem írunk háromszor ugyanolyan kódot.
*/
export const routes: Routes = [
  {
    path: '',
    title: '',
    data: {
      description:
        'Kézzel készült, egyedi parókák színházaknak, mindennapi viseletre és hajvesztés esetére. Budapest.',
    },
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'szinhaz',
    title: 'Parókák színházaknak',
    data: {
      segment: 'szinhaz',
      description: 'Korhű és karakterparókák tervezés alapján, parókaállomány javítása és bérlés.',
    },
    loadComponent: () => import('./pages/segment/segment-page').then((m) => m.SegmentPage),
  },
  {
    path: 'mindennapi',
    title: 'Parókák mindennapra',
    data: {
      segment: 'mindennapi',
      description: 'Természetes hatású, kézzel csomózott parókák a saját arcformádra szabva.',
    },
    loadComponent: () => import('./pages/segment/segment-page').then((m) => m.SegmentPage),
  },
  {
    path: 'hajpotlas',
    title: 'Paróka hajvesztés esetén',
    data: {
      segment: 'hajpotlas',
      description: 'Diszkrét konzultáció és bőrbarát parókák kemoterápia vagy alopécia esetén.',
    },
    loadComponent: () => import('./pages/segment/segment-page').then((m) => m.SegmentPage),
  },
  {
    path: 'munkaim',
    title: 'Munkáim',
    data: { description: 'Válogatás színházi és mindennapi parókáimból.' },
    loadComponent: () => import('./pages/gallery/gallery').then((m) => m.Gallery),
  },
  {
    path: 'ajanlatkeres',
    title: 'Ajánlatkérés',
    data: { description: 'Kérj konzultációt vagy árajánlatot egyedi parókára.' },
    loadComponent: () => import('./pages/inquiry/inquiry').then((m) => m.InquiryPage),
  },
  /*
    Admin felület. Nincs rá link az oldalon, a barátnőd a /admin címet
    könyvjelzőzi. A `noindex` miatt a Google sem veszi fel a találatok közé.

    A szülő route-nak nincs komponense, csak csoportosít: a gyerekek
    öröklik a `data`-ját, és mindkettő lazy betöltésű, így a látogatók
    soha nem töltik le az admin kódját.
  */
  {
    path: 'admin',
    data: { noindex: true },
    children: [
      {
        path: 'belepes',
        title: 'Belépés',
        loadComponent: () => import('./pages/admin/admin-login').then((m) => m.AdminLogin),
      },
      {
        path: '',
        title: 'Ajánlatkérések',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./pages/admin/admin-inquiries').then((m) => m.AdminInquiries),
      },
    ],
  },
  {
    path: '**',
    title: 'Az oldal nem található',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
