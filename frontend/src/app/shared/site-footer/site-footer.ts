import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/site.config';
import { LanguageService } from '../../core/i18n/language.service';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="wrap grid">
        <div class="brand">
          <img [src]="site.logo" alt="" width="64" height="70" />
          <div>
            <p class="name">{{ i18n.site().name }}</p>
            <p class="muted">{{ i18n.site().subtitle }} · {{ i18n.site().city }}</p>
          </div>
        </div>
        <div>
          <p class="label">{{ i18n.ui().footer.contact }}</p>
          <p>
            <a [href]="'mailto:' + site.email">{{ site.email }}</a><br />
            <a [href]="'tel:' + tel">{{ site.phone }}</a>
          </p>
        </div>
        <div>
          <p class="label">{{ i18n.ui().footer.follow }}</p>
          <p>
            <a [href]="site.facebook" target="_blank" rel="noopener">Facebook</a>
            @if (site.instagram) {
              <br /><a [href]="site.instagram" target="_blank" rel="noopener">Instagram</a>
            }
            @if (site.imdb) {
              <br /><a [href]="site.imdb" target="_blank" rel="noopener">IMDb</a>
            }
            @if (site.etsy) {
              <br /><a [href]="site.etsy" target="_blank" rel="noopener">{{ i18n.ui().common.etsy }}</a>
            }
          </p>
        </div>
        <div>
          <a class="btn btn--light" [routerLink]="i18n.path('/ajanlatkeres')">{{ i18n.ui().common.cta }}</a>
        </div>
      </div>
      <div class="wrap fine">
        <!-- A kötelező támogatói szöveg magyarul mindig látszik, angolul a fordítása is. -->
        <p class="funding">{{ site.fundingNotice }}</p>
        @if (i18n.ui().footer.fundingTranslation; as translation) {
          <p class="funding" lang="en">{{ translation }}</p>
        }
        <p>
          © {{ year }} {{ i18n.site().name }} {{ i18n.site().subtitle }} ·
          <a [routerLink]="i18n.path('/adatkezeles')">{{ i18n.ui().common.privacy }}</a>
        </p>
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
      padding: 0.375rem;
      width: 4.5rem;
      height: 4.5rem;
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
  protected readonly i18n = inject(LanguageService);
  protected readonly tel = SITE.phone.replace(/\s/g, '');
  protected readonly year = new Date().getFullYear();
}
