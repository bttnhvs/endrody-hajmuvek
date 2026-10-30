import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

/*
  Külön modul, mert az e-mail-küldés nem csak az ajánlatkérésekhez kellhet
  (később pl. időpontfoglalás-visszaigazoláshoz is). Az `exports` teszi
  elérhetővé a MailService-t azoknak a moduloknak, amik importálják ezt.
*/
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
