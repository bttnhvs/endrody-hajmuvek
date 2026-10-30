import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AdminGuard } from '../auth/admin.guard';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { InquiriesService } from './inquiries.service';
import { INQUIRY_STATUSES, type InquiryStatus } from './inquiry.types';

/*
  Controller = a végpontok. Minden metódus egy URL + HTTP-metódus párosra
  válaszol. A @Controller('inquiries') + a globális 'api' előtag miatt
  minden útvonal /api/inquiries-zel kezdődik.

  | Metódus | Útvonal                       | Ki hívja        |
  |---------|-------------------------------|-----------------|
  | POST    | /api/inquiries                | a weboldal űrlapja |
  | GET     | /api/inquiries?status=uj      | admin (token)   |
  | PATCH   | /api/inquiries/:id/status     | admin (token)   |
*/
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiries: InquiriesService) {}

  /*
    Nyilvános végpont, ezért szigorúbb limit: egy IP-ről legfeljebb
    5 ajánlatkérés 10 percenként. Ennél több valószínűleg spam.
  */
  @Post()
  @HttpCode(201)
  @Throttle({ default: { limit: 5, ttl: 10 * 60_000 } })
  async create(@Body() dto: CreateInquiryDto) {
    const saved = await this.inquiries.create(dto);
    // A spamrobotnak is "sikert" mondunk, hogy ne próbálkozzon tovább.
    return { ok: true, id: saved?.id ?? null };
  }

  @Get()
  @UseGuards(AdminGuard)
  findAll(@Query('status') status?: string) {
    if (status && !INQUIRY_STATUSES.includes(status as InquiryStatus)) {
      throw new BadRequestException('Az állapot lehet: uj, folyamatban, lezarva.');
    }
    return this.inquiries.findAll(status as InquiryStatus | undefined);
  }

  @Patch(':id/status')
  @UseGuards(AdminGuard)
  updateStatus(
    // A ParseUUIDPipe már itt kiszűri az érvénytelen azonosítókat (400-as hiba).
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.inquiries.updateStatus(id, dto.status);
  }
}
