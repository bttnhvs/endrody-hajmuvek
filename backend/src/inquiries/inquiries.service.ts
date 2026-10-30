import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { Inquiry } from './inquiry.entity';
import type { InquiryStatus } from './inquiry.types';

/*
  A service-ben van az üzleti logika – a controller csak fogadja a kérést
  és továbbadja ide. (Ugyanaz a felosztás, mint Angularban a komponens és
  a service között: a "vékony" réteg a felület, a "vastag" a logika.)

  A Repository<Inquiry> a TypeORM adatbázis-elérője ehhez a táblához:
  create, save, find, findOneBy... SQL írása nélkül.
*/
@Injectable()
export class InquiriesService {
  private readonly logger = new Logger(InquiriesService.name);

  constructor(
    @InjectRepository(Inquiry) private readonly repo: Repository<Inquiry>,
    private readonly mail: MailService,
  ) {}

  /**
   * Új ajánlatkérés mentése és értesítések küldése.
   * Visszaadja a mentett rekordot, vagy null-t, ha spamnek ítéltük.
   */
  async create(dto: CreateInquiryDto): Promise<Inquiry | null> {
    // Honeypot: ember nem tölti ki ezt a rejtett mezőt.
    if (dto.website) {
      this.logger.warn('Spamgyanús kérés eldobva (honeypot).');
      return null;
    }

    const inquiry = this.repo.create({
      type: dto.type,
      name: dto.name,
      email: dto.email.toLowerCase(),
      phone: dto.phone ?? '',
      message: dto.message,
      status: 'uj',
    });
    const saved = await this.repo.save(inquiry);

    /*
      Az e-mailek küldése nem akaszthatja meg a választ: ha a levélküldő épp
      nem elérhető, a kérés attól még el van mentve. Ezért allSettled
      (nem dob hibát), és a sikertelen küldést csak naplózzuk.
    */
    const results = await Promise.allSettled([
      this.mail.notifyOwner(saved),
      this.mail.confirmToCustomer(saved),
    ]);
    for (const r of results) {
      if (r.status === 'rejected') {
        this.logger.error(`Az e-mail küldése nem sikerült: ${String(r.reason)}`);
      }
    }

    return saved;
  }

  /** Az összes ajánlatkérés, legújabb elöl; opcionálisan állapot szerint szűrve. */
  findAll(status?: InquiryStatus): Promise<Inquiry[]> {
    return this.repo.find({
      where: status ? { status } : {},
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: InquiryStatus): Promise<Inquiry> {
    const inquiry = await this.repo.findOneBy({ id });
    if (!inquiry) {
      throw new NotFoundException('Nincs ilyen ajánlatkérés.');
    }
    inquiry.status = status;
    return this.repo.save(inquiry);
  }
}
