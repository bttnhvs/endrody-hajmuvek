import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AdminApiError, AdminApiService } from '../../core/admin/admin-api.service';
import { AdminAuthService } from '../../core/admin/admin-auth.service';
import { INQUIRY_STATUSES, typeLabel } from '../../core/inquiry-labels';
import { AdminInquiry, InquiryStatus } from '../../core/models';

type Filter = InquiryStatus | 'osszes';
type LoadState = 'loading' | 'ready' | 'error';

/*
  Az ajánlatkérések listája – signal alapú állapotkezelés.

  Az "igazság forrása" egyetlen signal: az `inquiries` tömb. Minden más
  (szűrt lista, darabszámok) computed, vagyis automatikusan újraszámolódik,
  ha a tömb vagy a szűrő változik. Nem kell kézzel szinkronban tartani őket.

  A szűrést a kliens végzi (egyszer töltjük le az összeset): egy kis műhelynél
  ez néhány száz sor, így a fülek közötti váltás azonnali, és a darabszámokhoz
  sem kell külön kérés.
*/
@Component({
  selector: 'app-admin-inquiries',
  imports: [DatePipe],
  templateUrl: './admin-inquiries.html',
  styleUrl: './admin-inquiries.css',
})
export class AdminInquiries {
  private readonly api = inject(AdminApiService);
  private readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);

  protected readonly statuses = INQUIRY_STATUSES;
  protected readonly typeLabel = typeLabel;

  protected readonly inquiries = signal<AdminInquiry[]>([]);
  protected readonly loadState = signal<LoadState>('loading');
  protected readonly filter = signal<Filter>('uj');
  /** Lista feletti hibaüzenet (betöltés vagy mentés sikertelen). */
  protected readonly error = signal('');
  /** Azoknak az ajánlatkéréseknek az id-ja, amelyek mentése épp folyamatban van. */
  protected readonly saving = signal<ReadonlySet<string>>(new Set());

  protected readonly visible = computed(() => {
    const filter = this.filter();
    const all = this.inquiries();
    return filter === 'osszes' ? all : all.filter((i) => i.status === filter);
  });

  protected readonly counts = computed(() => {
    const counts: Record<Filter, number> = { uj: 0, folyamatban: 0, lezarva: 0, osszes: 0 };
    for (const i of this.inquiries()) {
      counts[i.status]++;
      counts.osszes++;
    }
    return counts;
  });

  protected readonly filters = computed(() => [
    ...this.statuses.map((s) => ({ id: s.id as Filter, label: s.label })),
    { id: 'osszes' as Filter, label: 'Összes' },
  ]);

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loadState.set('loading');
    this.error.set('');
    this.api.list().subscribe({
      next: (list) => {
        this.inquiries.set(list);
        this.loadState.set('ready');
      },
      error: (err: AdminApiError) => {
        this.error.set(err.message);
        this.loadState.set('error');
      },
    });
  }

  protected onStatusChange(item: AdminInquiry, event: Event): void {
    const status = (event.target as HTMLSelectElement).value as InquiryStatus;
    this.changeStatus(item, status);
  }

  /*
    Optimista frissítés: a felület azonnal az új állapotot mutatja, a mentés
    a háttérben fut. Ha a backend hibát ad, visszaállítjuk a régi értéket.
    Így a felület gyors, de soha nem mutat olyat, ami nincs elmentve.
  */
  private changeStatus(item: AdminInquiry, status: InquiryStatus): void {
    const previous = item.status;
    if (previous === status) return;

    this.setStatus(item.id, status);
    this.setSaving(item.id, true);
    this.error.set('');

    this.api.updateStatus(item.id, status).subscribe({
      next: () => this.setSaving(item.id, false),
      error: (err: AdminApiError) => {
        this.setStatus(item.id, previous);
        this.setSaving(item.id, false);
        this.error.set(`Nem sikerült menteni (${item.name}): ${err.message}`);
      },
    });
  }

  /*
    A signal tartalmát nem módosítjuk helyben (nem írjuk át item.status-t),
    hanem új tömböt adunk neki. A signal referencia alapján veszi észre a
    változást – ugyanaz az elv, mint az OnPush change detectionnél.
  */
  private setStatus(id: string, status: InquiryStatus): void {
    this.inquiries.update((list) => list.map((i) => (i.id === id ? { ...i, status } : i)));
  }

  private setSaving(id: string, on: boolean): void {
    this.saving.update((set) => {
      const next = new Set(set);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  /** Válaszlevél előre kitöltött tárggyal (az ékezetek miatt kódolni kell az URL-ben). */
  protected mailtoLink(item: AdminInquiry): string {
    const subject = `Re: ajánlatkérés – ${typeLabel(item.type)}`;
    return `mailto:${item.email}?subject=${encodeURIComponent(subject)}`;
  }

  /** A tel: linkben nem lehet szóköz: "+36 30 123 4567" → "+36301234567" */
  protected telLink(item: AdminInquiry): string {
    return `tel:${item.phone.replace(/[^\d+]/g, '')}`;
  }

  protected logout(): void {
    this.auth.logout();
    void this.router.navigate(['/admin/belepes']);
  }
}
