import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content.service';
import { Segment } from '../../core/models';
import { WorkCard } from '../../shared/work-card/work-card';
import { FaqList } from '../../shared/faq-list/faq-list';
import { ProcessSteps } from '../../shared/process-steps/process-steps';
import { AboutMaker } from '../../shared/about-maker/about-maker';

/*
  Egy komponens – három aloldal.

  A `segment` inputot a router tölti ki a route `data.segment` értékéből
  (ehhez kell a withComponentInputBinding() az app.config.ts-ben).
  Minden más ebből származik `computed()`-dal, így ha a route változik,
  az egész oldal automatikusan átvált.
*/
@Component({
  selector: 'app-segment-page',
  imports: [RouterLink, CurrencyPipe, NgOptimizedImage, WorkCard, FaqList, ProcessSteps, AboutMaker],
  templateUrl: './segment-page.html',
  styleUrl: './segment-page.css',
})
export class SegmentPage {
  private readonly content = inject(ContentService);

  readonly segment = input.required<Segment>();

  protected readonly info = computed(() => this.content.segment(this.segment()));
  protected readonly photo = computed(() => this.content.work(this.info().photoId));
  protected readonly works = computed(() => this.content.worksFor(this.segment()));
  protected readonly faqs = computed(() => this.content.faqsFor(this.segment()));
  protected readonly isMedical = computed(() => this.segment() === 'hajpotlas');
}
