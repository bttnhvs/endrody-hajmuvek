import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { alternatePath, langOf } from './i18n/paths';
import { SITE_EN } from './i18n/site.en';
import { SITE } from './site.config';

/*
  Saját TitleStrategy – SEO.

  A routokban megadott `title` és `data.description` alapján minden
  oldalváltáskor beállítja a böngészőfül címét és a meta descriptiont.
  Ez kell ahhoz, hogy a Google értelmes címet és leírást mutasson.

  Az Angular alapból csak a címet állítja; ezt az osztályt az
  app.config.ts-ben "cseréljük be" a gyári helyett.
*/
@Injectable()
export class SeoTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const pageTitle = this.buildTitle(snapshot);
    const lang = langOf(snapshot.url);
    const { name, tagline } = lang === 'en' ? SITE_EN : SITE;
    this.title.setTitle(pageTitle ? `${pageTitle} – ${name}` : `${name} – ${tagline}`);
    // A képernyőolvasók és a böngésző fordítója ebből tudják az oldal nyelvét.
    this.doc.documentElement.lang = lang;

    // A legmélyebb aktív route `data`-jából olvassuk a leírást.
    let route = snapshot.root;
    while (route.firstChild) route = route.firstChild;
    const description = route.data['description'] as string | undefined;
    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
    }

    /*
      A `data.noindex` jelölésű oldalakat (pl. admin) a keresők ne indexeljék.
      A route data öröklődik a komponens nélküli szülőtől, ezért elég a
      legmélyebb route-ot nézni. Más oldalra lépve a taget eltávolítjuk.
    */
    if (route.data['noindex']) {
      this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    } else {
      this.meta.removeTag("name='robots'");
    }

    const indexable = !route.data['noindex'] && route.routeConfig?.path !== '**';
    this.updateLanguageLinks(snapshot.url, indexable);
  }

  /*
    A hreflang linkek mondják meg a Google-nek, hogy a magyar és az angol oldal
    ugyanannak a tartalomnak két nyelvi változata, így nem számít duplikált tartalomnak.
  */
  private updateLanguageLinks(url: string, indexable: boolean): void {
    this.doc.head.querySelectorAll('link[data-lang-link]').forEach((el) => el.remove());
    if (!indexable) return;

    const path = url.split(/[?#]/)[0];
    const other = alternatePath(path);
    const [huPath, enPath] = langOf(path) === 'hu' ? [path, other] : [other, path];
    const origin = this.doc.location.origin;

    this.addLink({ rel: 'canonical', href: origin + path });
    this.addLink({ rel: 'alternate', hreflang: 'hu', href: origin + huPath });
    this.addLink({ rel: 'alternate', hreflang: 'en', href: origin + enPath });
    this.addLink({ rel: 'alternate', hreflang: 'x-default', href: origin + huPath });
  }

  private addLink(attributes: Record<string, string>): void {
    const link = this.doc.createElement('link');
    link.setAttribute('data-lang-link', '');
    Object.entries(attributes).forEach(([name, value]) => link.setAttribute(name, value));
    this.doc.head.appendChild(link);
  }
}
