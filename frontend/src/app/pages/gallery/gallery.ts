import { Component, computed, inject, signal } from '@angular/core';
import { ContentService } from '../../core/content.service';
import { WorkCategory } from '../../core/models';
import { WorkCard } from '../../shared/work-card/work-card';

type Filter = WorkCategory | 'osszes';

/*
  Szűrhető galéria – a signalok tankönyvi példája:
  - `active`: írható signal (melyik szűrő van kiválasztva)
  - `visible`: computed – automatikusan újraszámolódik, ha `active` vagy
    a galéria tartalma változik. Nincs subscribe, nincs kézi frissítés.
*/
@Component({
  selector: 'app-gallery',
  imports: [WorkCard],
  template: `
    <section class="wrap intro">
      <h1>Munkáim</h1>
      <p class="lead">
        Színpadi és karakterparókák, természetes hatású parókák, szakállak és bajuszok –
        és néhány pillanat a műhelyből.
      </p>

      <div class="filters" role="group" aria-label="Szűrés a munka típusa szerint">
        @for (f of filters(); track f.id) {
          <button
            type="button"
            class="chip"
            [attr.aria-pressed]="active() === f.id"
            (click)="active.set(f.id)"
          >
            {{ f.label }} <span class="count">{{ f.count }}</span>
          </button>
        }
      </div>
    </section>

    <section class="wrap">
      <div class="grid">
        @for (item of visible(); track item.id; let i = $index) {
          <app-work-card [item]="item" [priority]="i < 4" />
        }
      </div>
    </section>
  `,
  styles: `
    .intro {
      padding-block: clamp(3rem, 7vw, 5rem) 2rem;
    }
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }
    .chip {
      font: 500 var(--step-0) var(--font-body);
      padding: 0.5em 1.1em;
      border-radius: 999px;
      border: 1.5px solid var(--line);
      background: transparent;
      color: var(--ink);
      cursor: pointer;
    }
    .chip:hover {
      border-color: var(--ink);
    }
    .chip[aria-pressed='true'] {
      background: var(--leaf-tint);
      border-color: var(--sage);
      color: var(--ink);
    }
    .count {
      opacity: 0.6;
      margin-left: 0.25em;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
      gap: 2rem 1.5rem;
    }
  `,
})
export class Gallery {
  private readonly content = inject(ContentService);

  protected readonly active = signal<Filter>('osszes');

  protected readonly visible = computed(() => {
    const filter = this.active();
    const all = this.content.gallery();
    return filter === 'osszes' ? all : all.filter((g) => g.category === filter);
  });

  /** A szűrőgombok a darabszámmal – a kategóriák listája a címkékből jön. */
  protected readonly filters = computed(() => {
    const all = this.content.gallery();
    const labels = this.content.categoryLabels;
    const categories = Object.keys(labels) as WorkCategory[];
    return [
      { id: 'osszes' as Filter, label: 'Összes', count: all.length },
      ...categories.map((c) => ({
        id: c as Filter,
        label: labels[c],
        count: all.filter((g) => g.category === c).length,
      })),
    ];
  });
}
