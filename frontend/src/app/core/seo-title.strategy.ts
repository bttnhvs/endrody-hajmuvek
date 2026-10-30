import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
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

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const pageTitle = this.buildTitle(snapshot);
    this.title.setTitle(pageTitle ? `${pageTitle} – ${SITE.name}` : `${SITE.name} – ${SITE.tagline}`);

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
  }
}
