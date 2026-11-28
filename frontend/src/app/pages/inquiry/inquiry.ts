import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { INQUIRY_TYPES, typeLabel } from '../../core/inquiry-labels';
import { NetlifyFormsService } from '../../core/netlify-forms.service';
import { InquiryType } from '../../core/models';
import { SITE } from '../../core/site.config';
import { LanguageService } from '../../core/i18n/language.service';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/*
  Ajánlatkérő űrlap – típusos Reactive Forms, beküldés a Netlify Formsnak.

  - NonNullableFormBuilder: a mezők típusa string (nem string | null),
    és reset() után az eredeti értékre állnak vissza.
  - A `tipus` input a ?tipus=... query paraméterből jön (router binding),
    így az aloldalak "Ajánlatot kérek" gombja előre kiválasztja a típust.
  - A küldés állapota egy signal: idle → sending → sent / error.
  - A beküldött üzeneteket Judit a Netlify felületén látja (Forms), és e-mailt is kap róluk.
*/
@Component({
  selector: 'app-inquiry',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './inquiry.html',
  styleUrl: './inquiry.css',
})
export class InquiryPage implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly forms = inject(NetlifyFormsService);
  protected readonly i18n = inject(LanguageService);

  /** ?tipus=szinhaz */
  readonly tipus = input<string>();

  /** A típusok azonosítója közös, a felirat az aktuális nyelvet követi. */
  protected readonly types = computed(() =>
    INQUIRY_TYPES.map((t) => ({ id: t.id, label: this.i18n.ui().inquiry.types[t.id] })),
  );
  protected readonly site = SITE;
  protected readonly tel = SITE.phone.replace(/\s/g, '');
  protected readonly status = signal<Status>('idle');
  protected readonly submitted = signal(false);
  /** Felhasználónak szóló hibaüzenet, ha a küldés nem sikerült. */
  protected readonly errorMessage = signal('');

  protected readonly form = this.fb.group({
    type: this.fb.control<InquiryType>('mindennapi', Validators.required),
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    message: ['', [Validators.required, Validators.minLength(10)]],
    consent: [false, Validators.requiredTrue],
    // Honeypot: a látogató nem látja, a spamrobotok kitöltik – a Netlify az ilyet eldobja.
    botField: [''],
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
    const value = this.form.getRawValue();

    this.forms
      .submit('ajanlatkeres', {
        'bot-field': value.botField,
        // A típus magyar felirata kerül a Netlifyba, hogy Judit azonnal értse.
        type: typeLabel(value.type),
        name: value.name,
        email: value.email,
        phone: value.phone,
        message: value.message,
        consent: value.consent ? 'igen' : 'nem',
        language: this.i18n.lang(),
      })
      .pipe(finalize(() => this.submitted.set(false)))
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
