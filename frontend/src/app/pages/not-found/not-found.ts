import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="wrap" style="padding-block: var(--section)">
      <h1>Ez az oldal nem létezik</h1>
      <p class="lead">Lehet, hogy elírás van a címben, vagy az oldal közben megszűnt.</p>
      <a class="btn" routerLink="/">Vissza a főoldalra</a>
    </section>
  `,
})
export class NotFound {}
