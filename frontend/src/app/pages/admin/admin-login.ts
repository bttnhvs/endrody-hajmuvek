import { Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminApiError, AdminApiService } from '../../core/admin/admin-api.service';
import { AdminAuthService } from '../../core/admin/admin-auth.service';

/*
  Admin belépés tokennel.

  Belépéskor nem csak elmentjük a tokent, hanem egy próbakéréssel
  ellenőrizzük is: ha a backend 401-et ad, a token hibás, és itt helyben
  kiírjuk – nem engedjük tovább egy üres listára.
*/
@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule],
  template: `
    <section class="wrap login">
      <h1>Belépés</h1>
      <p class="lead">Az ajánlatkérések kezeléséhez add meg a belépési kódot.</p>

      @if (lejart() && !error()) {
        <p class="notice" role="status">A belépés lejárt vagy megváltozott a kód. Lépj be újra.</p>
      }

      <form class="form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <!-- A rejtett felhasználónév segít a böngésző jelszókezelőjének megjegyezni a kódot. -->
        <input type="text" name="username" value="admin" autocomplete="username" hidden />
        <div class="field">
          <label for="token">Belépési kód</label>
          <input id="token" type="password" formControlName="token" autocomplete="current-password"
            [attr.aria-invalid]="!!error()" aria-describedby="token-err" />
        </div>
        @if (error()) {
          <p class="error" id="token-err" role="alert">{{ error() }}</p>
        }
        <button class="btn" type="submit" [disabled]="checking()">
          {{ checking() ? 'Ellenőrzés…' : 'Belépés' }}
        </button>
      </form>
    </section>
  `,
  styles: `
    .login {
      max-width: 30rem;
      padding-block: var(--section);
    }
    h1 {
      font-size: var(--step-3);
    }
    .form {
      display: grid;
      gap: 1rem;
      background: var(--paper-tint);
      border-radius: var(--radius-lg);
      padding: clamp(1.5rem, 4vw, 2rem);
    }
    .field {
      display: grid;
      gap: 0.35rem;
    }
    label {
      font-weight: 600;
    }
    input {
      font: inherit;
      padding: 0.75rem 0.9rem;
      border: 1.5px solid var(--line);
      border-radius: var(--radius-sm);
      background: var(--paper);
    }
    input[aria-invalid='true'] {
      border-color: var(--rose);
    }
    .btn {
      justify-self: start;
    }
    .error {
      color: var(--rose-deep);
      margin: 0;
    }
    .notice {
      background: var(--leaf-tint);
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
    }
  `,
})
export class AdminLogin {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AdminAuthService);
  private readonly api = inject(AdminApiService);
  private readonly router = inject(Router);

  /** ?lejart=1 – az interceptor ezzel küld vissza, ha a token érvénytelenné vált. */
  readonly lejart = input<string>();

  protected readonly checking = signal(false);
  protected readonly error = signal('');

  protected readonly form = this.fb.group({
    token: ['', Validators.required],
  });

  protected submit(): void {
    const token = this.form.controls.token.value.trim();
    if (!token) {
      this.error.set('Add meg a belépési kódot.');
      return;
    }

    this.checking.set(true);
    this.error.set('');
    this.auth.login(token);

    this.api.list().subscribe({
      next: () => void this.router.navigate(['/admin']),
      error: (err: AdminApiError) => {
        // Hibás token esetén az interceptor már kiléptetett; más hibánál mi tesszük.
        this.auth.logout();
        this.error.set(err.message);
        this.checking.set(false);
      },
    });
  }
}
