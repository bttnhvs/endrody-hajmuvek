import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/site.config';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="wrap grid">
        <div class="brand">
          <img [src]="site.logo" alt="" width="64" height="70" />
          <div>
            <p class="name">{{ site.name }}</p>
            <p class="muted">{{ site.subtitle }} · {{ site.city }}</p>
          </div>
        </div>
        <div>
          <p class="label">Elérhetőség</p>
          <p>
            <a [href]="'mailto:' + site.email">{{ site.email }}</a><br />
            <a [href]="'tel:' + tel">{{ site.phone }}</a>
          </p>
        </div>
        <div>
          <p class="label">Kövess</p>
          <p>
            <a [href]="site.facebook" target="_blank" rel="noopener">Facebook</a>
            @if (site.instagram) {
              <br /><a [href]="site.instagram" target="_blank" rel="noopener">Instagram</a>
            }
          </p>
        </div>
        <div>
          <a class="btn btn--light" routerLink="/ajanlatkeres">Konzultációt kérek</a>
        </div>
      </div>
      <div class="wrap fine">
        <p class="funding">{{ site.fundingNotice }}</p>
        <p>© {{ year }} {{ site.name }} {{ site.subtitle }}</p>
      </div>
    </footer>
  `,
  styles: `
    .footer {
      background: var(--green);
      color: #f1f6ee;
      padding-block: 3.5rem 2rem;
      margin-top: var(--section);
    }
    .grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr auto;
      gap: 2rem;
      align-items: start;
    }
    .brand {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    /* A logó sötét háttéren: világos "medál" mögötte */
    .brand img {
      background: #fff;
      border-radius: 50%;
      padding: 6px;
      width: 72px;
      height: 72px;
      object-fit: contain;
    }
    .name {
      font-family: var(--font-display);
      font-size: 1.5rem;
      color: #fff;
      margin-bottom: 0.15rem;
    }
    .label {
      color: #fff;
      font-weight: 600;
      margin-bottom: 0.4rem;
    }
    .muted { color: #e2ebde; margin: 0; }
    a { color: #fff; }
    a:hover { color: #fde4ee; }
    .btn--light {
      background: var(--blush);
      border-color: var(--blush);
      color: var(--ink);
    }
    .btn--light:hover {
      background: #fff;
      border-color: #fff;
      color: var(--ink);
    }
    .fine {
      margin-top: 2.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid rgb(255 255 255 / 0.25);
      font-size: var(--step--1);
      color: #e2ebde;
    }
    .funding {
      max-width: 80ch;
    }
    @media (max-width: 760px) {
      .grid { grid-template-columns: 1fr; }
    }
  `,
})
export class SiteFooter {
  protected readonly site = SITE;
  protected readonly tel = SITE.phone.replace(/\s/g, '');
  protected readonly year = new Date().getFullYear();
}
