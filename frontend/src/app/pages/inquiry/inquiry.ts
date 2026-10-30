import { Component, OnInit, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { INQUIRY_TYPES } from '../../core/inquiry-labels';
import { InquiryService } from '../../core/inquiry.service';
import { InquiryType } from '../../core/models';
import { SITE } from '../../core/site.config';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/*
  Ajánlatkérő űrlap – típusos Reactive Forms.

  - NonNullableFormBuilder: a mezők típusa string (nem string | null),
    és reset() után az eredeti értékre állnak vissza.
  - A `tipus` input a ?tipus=... query paraméterből jön (router binding),
    így a "Diszkrét konzultációt kérek" gomb előre kiválasztja a típust.
  - A küldés állapota egy signal: idle → sending → sent / error.
*/
@Component({
  selector: 'app-inquiry',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './inquiry.html',
  styleUrl: './inquiry.css',
})
export class InquiryPage implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly inquiries = inject(InquiryService);

  /** ?tipus=hajpotlas */
  readonly tipus = input<string>();

  protected readonly types = INQUIRY_TYPES;
  protected readonly site = SITE;
  protected readonly tel = SITE.phone.replace(/\s/g, '');
  protected readonly status = signal<Status>('idle');
  protected readonly submitted = signal(false);
  /** A backendtől kapott, felhasználónak szóló hibaüzenet. */
  protected readonly errorMessage = signal('');
  /** Igaz, ha a küldés már szokatlanul sokáig tart (alvó szerver). */
  protected readonly slow = signal(false);

  protected readonly form = this.fb.group({
    type: this.fb.control<InquiryType>('mindennapi', Validators.required),
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    message: ['', [Validators.required, Validators.minLength(10)]],
    consent: [false, Validators.requiredTrue],
    // Honeypot: a felhasználó nem látja, a spamrobotok kitöltik (a backend eldobja)
    website: [''],
  });

  ngOnInit(): void {
    const fromUrl = this.tipus();
    if (INQUIRY_TYPES.some((t) => t.id === fromUrl)) {
      this.form.controls.type.setValue(fromUrl as InquiryType);
    }
  }

  /** Hibaüzenet akkor látszik, ha a mező hibás ÉS már hozzányúltak vagy beküldték. */
  protected showError(name: 'name' | 'email' | 'message' | 'consent'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.submitted());
  }

  protected submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.status.set('sending');

    /*
      A Render ingyenes szervere tétlenség után elalszik, az első kérés
      ilyenkor fél percig is tarthat. Ha 4 mp után sincs válasz, megnyugtató
      üzenetet mutatunk, hogy a látogató ne higgye, hogy elromlott az oldal.
    */
    const slowTimer = setTimeout(() => this.slow.set(true), 4000);

    this.inquiries
      .send(this.form.getRawValue())
      .pipe(
        finalize(() => {
          clearTimeout(slowTimer);
          this.slow.set(false);
          this.submitted.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.status.set('sent');
          this.form.reset();
        },
        error: (err: Error) => {
          this.errorMessage.set(err.message);
          this.status.set('error');
        },
      });
  }
}
