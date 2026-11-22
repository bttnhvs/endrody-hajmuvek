import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, isDevMode, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/i18n/language.service';
import { SITE } from '../../core/site.config';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/*
  "Workshopok és magánórák – hamarosan" blokk feliratkozással.

  A feliratkozás a Formspree-hez megy, nem a saját backendünkhöz: egy egyszerű
  érdeklődőlistához nem kell új adatbázistábla és végpont.

  Amíg nincs beállítva a `SITE.workshopFormspreeId`:
  - fejlesztés közben (ng serve) az űrlap látszik, és csak szimulálja a küldést,
  - élesben az űrlap helyett egy link visz az ajánlatkérésre, így nem vész el feliratkozó.
*/
@Component({
  selector: 'app-workshop-teaser',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    @let t = i18n.ui().workshop;

    <section class="teaser wrap" aria-labelledby="workshop-cim">
      <div class="teaser__intro">
        <h2 id="workshop-cim">{{ t.title }}</h2>
        <p>{{ t.lead }}</p>
        <ul class="topics">
          @for (topic of t.topics; track topic.title) {
            <li><strong>{{ topic.title }}:</strong> {{ topic.text }}</li>
          }
        </ul>

        @if (status() === 'sent') {
          <p class="done" role="status">{{ t.success }}</p>
        } @else if (canSubscribe) {
          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <label for="workshop-email">{{ t.emailLabel }}</label>
            <div class="signup">
              <input
                id="workshop-email"
                type="email"
                formControlName="email"
                autocomplete="email"
                [attr.aria-invalid]="showError('email')"
              />
              <button class="btn btn--ghost" type="submit" [disabled]="status() === 'sending'">
                {{ status() === 'sending' ? t.sending : t.notify }}
              </button>
            </div>
            @if (showError('email')) {
              <p class="error">{{ t.emailError }}</p>
            }

            <!-- Spamcsapda: a Formspree eldobja a kérést, ha ez ki van töltve. -->
            <div class="trap" aria-hidden="true">
              <label for="workshop-gotcha">Website</label>
              <input id="workshop-gotcha" type="text" formControlName="_gotcha" tabindex="-1" autocomplete="off" />
            </div>

            <label class="consent">
              <input type="checkbox" formControlName="consent" />
              <span>{{ t.consent }}</span>
            </label>
            @if (showError('consent')) {
              <p class="error">{{ t.consentError }}</p>
            }
            @if (status() === 'error') {
              <p class="error" role="alert">{{ t.error }}</p>
            }
          </form>
        } @else {
          <a class="btn btn--ghost" [routerLink]="i18n.path('/ajanlatkeres')" [queryParams]="{ tipus: 'egyeb' }">
            {{ t.fallback }}
          </a>
        }
      </div>

      <ul class="cards">
        @for (card of t.cards; track card.title) {
          <li class="card">
            <h3>{{ card.title }}</h3>
            <p>{{ card.text }}</p>
          </li>
        }
      </ul>
    </section>
  `,
  styles: `
    .teaser {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: clamp(2rem, 5vw, 4rem);
      align-items: start;
      padding-block: clamp(2.5rem, 5vw, 3.5rem);
      margin-bottom: clamp(1.5rem, 4vw, 3rem);
      border-top: 1px solid var(--line);
    }
    h2 {
      font-size: var(--step-2);
    }
    p {
      color: var(--ink-soft);
    }
    .topics {
      list-style: none;
      margin: 0 0 1.5rem;
      padding: 0;
      color: var(--ink-soft);
    }
    .topics li + li {
      margin-top: 0.25rem;
    }
    .topics strong {
      color: var(--ink);
      font-weight: 600;
    }
    label {
      display: block;
      margin-bottom: 0.35rem;
      font-weight: 600;
      font-size: var(--step--1);
    }
    .signup {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }
    input[type='email'] {
      flex: 1 1 14rem;
      min-width: 0;
      padding: 0.7em 0.9em;
      font: inherit;
      color: var(--ink);
      background: var(--surface);
      border: 1.5px solid var(--line);
      border-radius: var(--radius-sm);
    }
    input[aria-invalid='true'] {
      border-color: var(--rose);
    }
    .consent {
      display: flex;
      align-items: flex-start;
      gap: 0.55rem;
      margin: 0.85rem 0 0;
      font-weight: 400;
      color: var(--ink-soft);
    }
    .consent input {
      margin-top: 0.2em;
      accent-color: var(--rose);
    }
    .error {
      margin: 0.4rem 0 0;
      color: var(--rose-deep);
      font-size: var(--step--1);
    }
    .done {
      color: var(--ink);
      font-weight: 600;
    }
    .trap {
      position: absolute;
      left: -9999px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    }
    .cards {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 1rem;
    }
    .card {
      padding: 1.25rem 1.4rem;
      background: var(--paper-tint);
      border-radius: var(--radius-sm);
    }
    .card h3 {
      margin-bottom: 0.3rem;
    }
    .card p {
      margin: 0;
    }
    @media (max-width: 860px) {
      .teaser {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class WorkshopTeaser {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly i18n = inject(LanguageService);

  // A `string` típus kell, mert a SITE `as const`, és az üres érték típusa különben ''.
  private readonly formId: string = SITE.workshopFormspreeId;
  protected readonly canSubscribe = !!this.formId || isDevMode();

  protected readonly status = signal<Status>('idle');
  private readonly submitted = signal(false);

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    consent: [false, Validators.requiredTrue],
    _gotcha: [''],
  });

  protected showError(name: 'email' | 'consent'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.submitted());
  }

  protected submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.formId) {
      this.status.set('sent');
      return;
    }

    this.status.set('sending');
    const { email, consent, _gotcha } = this.form.getRawValue();
    this.http
      .post(
        `https://formspree.io/f/${this.formId}`,
        {
          email,
          consent,
          _gotcha,
          language: this.i18n.lang(),
          _subject: 'Új feliratkozó: workshopok és magánórák',
        },
        // Enélkül a Formspree JSON helyett egy átirányító oldalt adna vissza.
        { headers: new HttpHeaders({ Accept: 'application/json' }) },
      )
      .subscribe({
        next: () => this.status.set('sent'),
        error: () => this.status.set('error'),
      });
  }
}
