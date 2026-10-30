import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminGuard } from '../auth/admin.guard';
import { MailModule } from '../mail/mail.module';
import { InquiriesController } from './inquiries.controller';
import { InquiriesService } from './inquiries.service';
import { Inquiry } from './inquiry.entity';

/*
  Egy "feature modul" mindent összefog, ami az ajánlatkérésekhez tartozik.
  - TypeOrmModule.forFeature([Inquiry]): elérhetővé teszi a Repository<Inquiry>-t
  - MailModule: innen jön a MailService
*/
@Module({
  imports: [TypeOrmModule.forFeature([Inquiry]), MailModule],
  controllers: [InquiriesController],
  providers: [InquiriesService, AdminGuard],
})
export class InquiriesModule {}
