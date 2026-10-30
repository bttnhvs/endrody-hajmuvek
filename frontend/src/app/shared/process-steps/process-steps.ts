import { Component, inject } from '@angular/core';
import { ContentService } from '../../core/content.service';

/*
  "Hogyan készül" – valódi sorrend, ezért számozott lista (<ol>).
  A számozást CSS counter adja, nem kézzel írjuk bele.
*/
@Component({
  selector: 'app-process-steps',
  template: `
    <ol class="steps">
      @for (step of content.process(); track step.title) {
        <li class="step">
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
          <span class="duration">{{ step.duration }}</span>
        </li>
      }
    </ol>
  `,
  styles: `
    .steps {
      counter-reset: step;
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      border-top: 1.5px solid var(--sage);
    }
    .step {
      counter-increment: step;
      padding: 1.25rem 1.25rem 0 0;
    }
    .step::before {
      content: counter(step);
      display: block;
      font-family: var(--font-display);
      font-style: italic;
      font-size: 3rem;
      line-height: 1;
      color: var(--rose);
      margin-bottom: 0.75rem;
    }
    .step p {
      color: var(--ink-soft);
      margin-bottom: 0.5rem;
    }
    .duration {
      font-size: var(--step--1);
      font-weight: 600;
      color: var(--sage);
    }
    @media (max-width: 960px) {
      .steps {
        grid-template-columns: 1fr;
        border-top: 0;
      }
      .step {
        display: grid;
        grid-template-columns: 3.5rem 1fr;
        column-gap: 1rem;
        padding: 1.25rem 0;
        border-top: 1px solid var(--line);
      }
      .step::before {
        grid-row: span 3;
        margin: 0;
      }
    }
  `,
})
export class ProcessSteps {
  protected readonly content = inject(ContentService);
}
