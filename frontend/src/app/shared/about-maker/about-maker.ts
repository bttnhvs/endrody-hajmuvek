import { Component, booleanAttribute, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/site.config';

/*
  "Rólam" blokk – a bizalomépítés egyik legerősebb eleme: a vevő látja,
  kivel fog találkozni.

  Ugyanazokat a díszítőelemeket használja, mint a hős szekció
  (íves képkeret, a logó koszorújára utaló zöld ív), így nem különálló
  doboznak, hanem az oldal részének hat.

  Két helyen használjuk:
  - főoldal: teljes változat (címkék, gomb)
  - "Hajvesztés esetén" oldal: `compact` változat (kis kép, egy bekezdés)

  <app-about-maker />            → teljes
  <app-about-maker compact />    → tömör (a puszta attribútum '' értéket adna;
                                     a beépített booleanAttribute transform ezt true-vá alakítja)
*/
@Component({
  selector: 'app-about-maker',
  imports: [NgOptimizedImage, RouterLink],
  template: `
    <div class="about" [class.about--compact]="compact()">
      <figure class="portrait">
        <div class="arch">
          <img
            [ngSrc]="about.image"
            [width]="about.width"
            [height]="about.height"
            [alt]="about.imageAlt"
          />
        </div>
      </figure>

      <div class="text">
        <h2>{{ about.heading }}</h2>
        @for (p of compact() ? about.paragraphs.slice(0, 1) : about.paragraphs; track $index) {
          <p>{{ p }}</p>
        }
        @if (about.makerName) {
          <p class="signature">{{ about.makerName }}</p>
        }
        @if (!compact()) {
          <ul class="tags" aria-label="Röviden rólam">
            @for (tag of about.tags; track tag) {
              <li>{{ tag }}</li>
            }
          </ul>
          <a class="btn" routerLink="/ajanlatkeres">Írj nekem</a>
        }
      </div>
    </div>
  `,
  styles: `
    .about {
      display: grid;
      grid-template-columns: 0.9fr 1.1fr;
      gap: clamp(2.5rem, 7vw, 6rem);
      align-items: center;
    }

    /* --- Kép: ugyanaz az íves keret és zöld ív, mint a hős szekcióban --- */
    .portrait {
      position: relative;
      margin: 0;
      width: min(100%, 25rem);
      justify-self: center;
    }
    .portrait::before {
      content: '';
      position: absolute;
      inset: -14px auto auto -14px;
      width: calc(100% + 28px);
      aspect-ratio: 1;
      border: 2px solid var(--leaf);
      border-radius: 50%;
      border-bottom-color: transparent;
      border-left-color: transparent;
      transform: rotate(20deg);
      pointer-events: none;
    }
    .arch {
      aspect-ratio: 4 / 5;
      border-radius: 999px 999px var(--radius-sm) var(--radius-sm);
      overflow: hidden;
      background: var(--leaf-tint);
    }
    .arch img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* --- Szöveg --- */
    .text p {
      font-size: var(--step-1);
      line-height: 1.55;
      color: var(--ink-soft);
    }
    .signature {
      font-family: var(--font-display);
      font-style: italic;
      font-size: var(--step-2) !important;
      color: var(--sage) !important;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      list-style: none;
      margin: 1.5rem 0 2rem;
      padding: 0;
    }
    .tags li {
      padding: 0.4em 0.9em;
      border-radius: 999px;
      background: var(--leaf-tint);
      color: var(--ink);
      font-size: var(--step--1);
      font-weight: 500;
    }

    /* --- Tömör változat --- */
    .about--compact {
      grid-template-columns: 9.375rem 1fr;
      gap: 2rem;
    }
    .about--compact .portrait::before {
      display: none;
    }
    .about--compact h2 {
      font-size: var(--step-2);
    }
    .about--compact .text p {
      font-size: var(--step-0);
    }

    @media (max-width: 860px) {
      .about {
        grid-template-columns: 1fr;
      }
      .portrait {
        width: min(100% - 2.5rem, 300px);
        justify-self: start;
        margin-bottom: 2rem;
      }
      .about--compact {
        grid-template-columns: 100px 1fr;
        gap: 1.25rem;
      }
      .about--compact .portrait {
        width: 100%;
      }
    }
  `,
})
export class AboutMaker {
  protected readonly about = SITE.about;
  readonly compact = input(false, { transform: booleanAttribute });
}
