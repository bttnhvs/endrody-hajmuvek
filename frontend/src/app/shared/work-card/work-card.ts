import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { GalleryItem } from '../../core/models';

/*
  Egy munka kártyája: fotó + cím + rövid leírás.

  NgOptimizedImage (`ngSrc`): az Angular képoptimalizáló direktívája.
  - alapból lusta betöltés (loading="lazy")
  - `priority` jelzővel a fold feletti képek előbb töltődnek
  - fejlesztés közben figyelmeztet, ha egy kép túl nagy a megjelenített mérethez

  `fill` mód: a fotók különböző arányúak (álló, fekvő, keskeny), a kártya
  viszont mindig 4:5-ös keretet mutat, és levágja a kilógó részt (object-fit: cover).
  Ilyenkor nem width/height kell, hanem `fill`: a kép kitölti a keretet, a helyet
  pedig a keret aspect-ratio-ja foglalja le (így sem ugrál az oldal). Width/height
  mellett az Angular NG02952 figyelmeztetést adna, mert a megjelenített arány
  eltér a fotóétól.
*/
@Component({
  selector: 'app-work-card',
  imports: [NgOptimizedImage],
  template: `
    <figure class="card">
      <div class="frame">
        <img [ngSrc]="item().image" fill [alt]="item().alt" [priority]="priority()" />
      </div>
      <figcaption>
        <span class="title">{{ item().title }}</span>
        <span class="caption">{{ item().caption }}</span>
      </figcaption>
    </figure>
  `,
  styles: `
    .card {
      margin: 0;
    }
    .frame {
      /* fill módban a kép position: absolute, ezért a keret legyen a viszonyítási pont */
      position: relative;
      aspect-ratio: 4 / 5;
      overflow: hidden;
      border-radius: var(--radius-sm);
      background: var(--canvas);
    }
    img {
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .card:hover img {
      transform: scale(1.03);
    }
    figcaption {
      display: grid;
      gap: 0.1rem;
      padding-top: 0.8rem;
    }
    .title {
      font-family: var(--font-display);
      font-size: var(--step-1);
      line-height: 1.25;
    }
    .caption {
      color: var(--ink-soft);
      font-size: var(--step--1);
    }
  `,
})
export class WorkCard {
  readonly item = input.required<GalleryItem>();
  /** A főoldal első képeinél true: ezek azonnal töltődjenek. */
  readonly priority = input(false);
}
