import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { Inquiry } from '../inquiries/inquiry.entity';
import { INQUIRY_TYPE_LABELS } from '../inquiries/inquiry.types';

/*
  E-mail küldés a Resend szolgáltatással (https://resend.com).

  Miért nem SMTP? A Resend sima HTTPS-kérésen keresztül küld, így olyan
  tárhelyen is működik (pl. Render ingyenes csomag), ahol a kimenő SMTP-portok
  le vannak tiltva. Ráadásul a Resend gondoskodik róla, hogy a levél ne
  menjen spambe (SPF/DKIM aláírás a saját domainhez).

  Ha nincs beállítva RESEND_API_KEY, "száraz módban" fut: az e-mailt csak
  kiírja a konzolra. Így fejlesztés közben is látod, mi menne ki.
*/

/** A Resend tesztfeladója: saját domain nélkül csak ezzel lehet küldeni. */
const DEFAULT_FROM = 'Endrődy Hajművek <onboarding@resend.dev>';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend | null;

  constructor(private readonly config: ConfigService) {
    const apiKey = config.get<string>('RESEND_API_KEY');
    this.resend = apiKey ? new Resend(apiKey) : null;
  }

  /** Értesítés a műhelynek egy új ajánlatkérésről. */
  async notifyOwner(inquiry: Inquiry): Promise<void> {
    const to = this.config.get<string>('MAIL_TO');
    if (!to) return;

    await this.send({
      to,
      replyTo: inquiry.email, // a "Válasz" gomb egyből a vevőnek ír
      subject: `Új ajánlatkérés: ${INQUIRY_TYPE_LABELS[inquiry.type]} – ${inquiry.name}`,
      html: `
        <h2>Új ajánlatkérés érkezett</h2>
        <p><strong>Típus:</strong> ${escapeHtml(INQUIRY_TYPE_LABELS[inquiry.type])}</p>
        <p><strong>Név:</strong> ${escapeHtml(inquiry.name)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(inquiry.email)}</p>
        <p><strong>Telefon:</strong> ${escapeHtml(inquiry.phone || '–')}</p>
        <p><strong>Üzenet:</strong></p>
        <p style="white-space: pre-wrap">${escapeHtml(inquiry.message)}</p>
      `,
    });
  }

  /**
   * Automatikus visszaigazolás a vevőnek.
   *
   * Alapból KI van kapcsolva (MAIL_CONFIRM_TO_CUSTOMER=true kapcsolja be), mert:
   * - saját, a Resendben ellenőrzött domain nélkül a Resend csak a fiók
   *   tulajdonosának küld, idegen címre nem;
   * - bárki beírhatja az űrlapba valaki más címét, és akkor mi küldenénk
   *   neki kéretlen levelet. Ez rontja a domain hírnevét.
   */
  async confirmToCustomer(inquiry: Inquiry): Promise<void> {
    if (this.config.get<string>('MAIL_CONFIRM_TO_CUSTOMER') !== 'true') return;

    await this.send({
      to: inquiry.email,
      subject: 'Megkaptam az üzeneted – Endrődy Hajművek',
      html: `
        <p>Kedves ${escapeHtml(inquiry.name)}!</p>
        <p>Köszönöm a megkeresésed, megkaptam az üzeneted. Két munkanapon belül
        jelentkezem, és egyeztetünk egy időpontot a konzultációra.</p>
        <p>Üdvözlettel:<br>Endrődy Hajművek Fodrászműhely</p>
      `,
    });
  }

  private async send(mail: { to: string; subject: string; html: string; replyTo?: string }) {
    const from = this.config.get<string>('MAIL_FROM') || DEFAULT_FROM;

    if (!this.resend) {
      this.logger.log(`[száraz mód] E-mail ide: ${mail.to} | Tárgy: ${mail.subject}`);
      return;
    }

    /*
      A Resend kliens hibánál NEM dob kivételt, hanem { data, error } objektumot ad
      vissza. Ezt nekünk kell kivétellé alakítani, különben a hívó (InquiriesService,
      Promise.allSettled) azt hinné, hogy minden rendben ment, és a hiba nem kerülne
      a naplóba.
    */
    const { data, error } = await this.resend.emails.send({ from, ...mail });
    if (error) {
      throw new Error(`Resend hiba (${error.name}): ${error.message}`);
    }
    this.logger.log(`E-mail elküldve ide: ${mail.to} (Resend id: ${data?.id})`);
  }
}

/*
  FONTOS: a felhasználótól jövő szöveget soha nem tesszük nyersen HTML-be.
  Ha valaki a nevébe <script>-et vagy egy hamis linket ír, az e-mailben
  így csak szövegként jelenik meg (HTML-injekció elleni védelem).
*/
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
