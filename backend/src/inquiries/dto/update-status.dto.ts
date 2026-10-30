import { IsIn } from 'class-validator';
import { INQUIRY_STATUSES, type InquiryStatus } from '../inquiry.types';

export class UpdateStatusDto {
  @IsIn(INQUIRY_STATUSES, { message: 'Az állapot lehet: uj, folyamatban, lezarva.' })
  status!: InquiryStatus;
}
