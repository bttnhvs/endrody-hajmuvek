import { ConfigService } from '@nestjs/config';
import { Inquiry } from '../inquiries/inquiry.entity';
import { MailService } from './mail.service';

/*
  A 'resend' csomagot jest.mock-kal lecseréljük, így a teszt nem küld valódi
  levelet és nem kell hozzá internet. A jest.mock-ot a Jest a fájl elejére
  "emeli" (hoisting), ezért a mock már az import előtt életbe lép.

  A `mock` előtagú változónév kötelező: a Jest csak az ilyen nevű külső
  változókat engedi használni a jest.mock gyárfüggvényén belül.
*/
const mockSend = jest.fn();
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({ emails: { send: mockSend } })),
}));

/** Egyszerű ConfigService-utánzat: a megadott objektumból olvas. */
function configWith(values: Record<string, string>): ConfigService {
  return { get: (key: string, fallback?: string) => values[key] ?? fallback } as ConfigService;
}

const inquiry = {
  id: 'uuid-1',
  type: 'hajpotlas',
  name: 'Teszt <b>Elek</b>',
  email: 'teszt@pelda.hu',
  phone: '',
  message: 'Szeretnék egy konzultációt kérni.',
  status: 'uj',
  createdAt: new Date(),
} as Inquiry;

describe('MailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSend.mockResolvedValue({ data: { id: 'email-1' }, error: null });
  });

  it('API kulcs nélkül száraz módban fut, nem hívja a Resendet', async () => {
    const service = new MailService(configWith({ MAIL_TO: 'muhely@pelda.hu' }));

    await service.notifyOwner(inquiry);

    expect(mockSend).not.toHaveBeenCalled();
  });

  it('értesítőt küld a műhelynek, a válaszcím a vevő, a HTML escape-elve', async () => {
    const service = new MailService(
      configWith({ RESEND_API_KEY: 're_teszt', MAIL_TO: 'muhely@pelda.hu' }),
    );

    await service.notifyOwner(inquiry);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'muhely@pelda.hu',
        replyTo: 'teszt@pelda.hu',
        from: 'Endrődy Hajművek <onboarding@resend.dev>', // alapértelmezett feladó
      }),
    );
    const html: string = mockSend.mock.calls[0][0].html;
    expect(html).toContain('Teszt &lt;b&gt;Elek&lt;/b&gt;');
    expect(html).not.toContain('<b>Elek</b>');
  });

  it('a vevőnek alapból nem küld visszaigazolást', async () => {
    const service = new MailService(configWith({ RESEND_API_KEY: 're_teszt' }));

    await service.confirmToCustomer(inquiry);

    expect(mockSend).not.toHaveBeenCalled();
  });

  it('MAIL_CONFIRM_TO_CUSTOMER=true esetén küld visszaigazolást a vevőnek', async () => {
    const service = new MailService(
      configWith({ RESEND_API_KEY: 're_teszt', MAIL_CONFIRM_TO_CUSTOMER: 'true' }),
    );

    await service.confirmToCustomer(inquiry);

    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ to: 'teszt@pelda.hu' }));
  });

  it('kivételt dob, ha a Resend hibát ad vissza (így a hiba a naplóba kerül)', async () => {
    mockSend.mockResolvedValueOnce({
      data: null,
      error: { name: 'validation_error', message: 'Érvénytelen feladó' },
    });
    const service = new MailService(
      configWith({ RESEND_API_KEY: 're_teszt', MAIL_TO: 'muhely@pelda.hu' }),
    );

    await expect(service.notifyOwner(inquiry)).rejects.toThrow('Érvénytelen feladó');
  });
});
