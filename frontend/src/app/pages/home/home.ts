import { Component, computed, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { ProcessSteps } from '../../shared/process-steps/process-steps';
import { WorkCard } from '../../shared/work-card/work-card';
import { FaqList } from '../../shared/faq-list/faq-list';
import { AboutMaker } from '../../shared/about-maker/about-maker';
import { WorkshopTeaser } from '../../shared/workshop-teaser/workshop-teaser';
import { SITE } from '../../core/site.config';
import { LanguageService } from '../../core/i18n/language.service';

/** A főoldalon kiemelt munkák – azonosító alapján válogatva, ebben a sorrendben. */
const FEATURED_IDS = ['vizhullam', 'szakall', 'rozsaszin', 'barna', 'loknik', 'gondor'];

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgOptimizedImage, ProcessSteps, WorkCard, FaqList, AboutMaker, WorkshopTeaser],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly content = inject(ContentService);
  /** A referenciák (credits) a site.config.ts-ből jönnek. */
  protected readonly site = SITE;
  protected readonly i18n = inject(LanguageService);

  protected readonly featured = computed(() => {
    const all = this.content.gallery();
    // A filter(Boolean) után a TS nem tudja, hogy nincs undefined → type guard
    return FEATURED_IDS.map((id) => all.find((g) => g.id === id)).filter(
      (g): g is NonNullable<typeof g> => !!g,
    );
  });

  /** A "Műhelyből" sáv képei. */
  protected readonly workshop = computed(() => this.content.worksIn('muhely').slice(0, 3));

  protected readonly topFaqs = computed(() => this.content.faqs().slice(0, 4));
}
