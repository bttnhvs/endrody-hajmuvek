import { Component, input } from '@angular/core';
import { Faq } from '../../core/models';

/*
  GYIK – natív <details>/<summary> elemekkel.
  Nem kell hozzá egy sor TypeScript sem: a böngésző kezeli a
  nyitást-zárást, billentyűzettel és képernyőolvasóval is működik.
  Tanulság: ne írj komponens-logikát arra, amit a HTML már tud.
*/
@Component({
  selector: 'app-faq-list',
  template: `
    <div class="faq">
      @for (faq of faqs(); track faq.question) {
        <details>
          <summary>{{ faq.question }}</summary>
          <p>{{ faq.answer }}</p>
        </details>
      }
    </div>
  `,
  styles: `
    .faq {
      border-top: 1px solid var(--line);
      max-width: 52rem;
    }
    details {
      border-bottom: 1px solid var(--line);
    }
    summary {
      cursor: pointer;
      list-style: none;
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.15rem 0;
      font-weight: 600;
      font-size: var(--step-1);
      font-family: var(--font-display);
    }
    summary::-webkit-details-marker {
      display: none;
    }
    summary::after {
      content: '+';
      font-family: var(--font-body);
      color: var(--rose);
      transition: transform 0.2s;
    }
    details[open] summary::after {
      transform: rotate(45deg);
    }
    details p {
      color: var(--ink-soft);
      padding-bottom: 1.25rem;
    }
  `,
})
export class FaqList {
  readonly faqs = input.required<Faq[]>();
}
