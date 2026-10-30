import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiriesService } from './inquiries.service';
import { Inquiry } from './inquiry.entity';

/*
  Unit teszt: a service-t önmagában teszteljük, valódi adatbázis és
  e-mail nélkül. A függőségeit "mock"-okra cseréljük – pont úgy, ahogy
  Angularban a TestBed-ben a providers tömbben lecserélsz egy service-t.

  Futtatás: npm test
*/
describe('InquiriesService', () => {
  let service: InquiriesService;

  const repo = {
    create: jest.fn((data: Partial<Inquiry>) => data),
    save: jest.fn(async (data: Partial<Inquiry>) => ({ id: 'uuid-1', createdAt: new Date(), ...data })),
    find: jest.fn(),
    findOneBy: jest.fn(),
  };
  const mail = {
    notifyOwner: jest.fn().mockResolvedValue(undefined),
    confirmToCustomer: jest.fn().mockResolvedValue(undefined),
  };

  const validDto = (): CreateInquiryDto =>
    Object.assign(new CreateInquiryDto(), {
      type: 'hajpotlas',
      name: 'Teszt Elek',
      email: 'Teszt@Pelda.hu',
      message: 'Szeretnék egy konzultációt kérni.',
      consent: true,
    });

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        InquiriesService,
        { provide: getRepositoryToken(Inquiry), useValue: repo },
        { provide: MailService, useValue: mail },
      ],
    }).compile();

    service = moduleRef.get(InquiriesService);
  });

  it('elmenti az ajánlatkérést kisbetűs e-mail-címmel és "uj" állapottal', async () => {
    const saved = await service.create(validDto());

    expect(repo.save).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'teszt@pelda.hu', status: 'uj', phone: '' }),
    );
    expect(saved?.id).toBe('uuid-1');
  });

  it('értesíti a műhelyt és visszaigazolást küld a vevőnek', async () => {
    await service.create(validDto());

    expect(mail.notifyOwner).toHaveBeenCalledTimes(1);
    expect(mail.confirmToCustomer).toHaveBeenCalledTimes(1);
  });

  it('akkor is ment, ha az e-mail küldése nem sikerül', async () => {
    mail.notifyOwner.mockRejectedValueOnce(new Error('A Resend nem elérhető'));

    const saved = await service.create(validDto());

    expect(saved).not.toBeNull();
    expect(repo.save).toHaveBeenCalled();
  });

  it('a kitöltött honeypot mezővel érkező kérést nem menti el', async () => {
    const dto = Object.assign(validDto(), { website: 'http://spam.example' });

    const saved = await service.create(dto);

    expect(saved).toBeNull();
    expect(repo.save).not.toHaveBeenCalled();
    expect(mail.notifyOwner).not.toHaveBeenCalled();
  });

  it('nem létező azonosítónál NotFoundException-t dob', async () => {
    repo.findOneBy.mockResolvedValueOnce(null);

    await expect(service.updateStatus('nincs-ilyen', 'lezarva')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
