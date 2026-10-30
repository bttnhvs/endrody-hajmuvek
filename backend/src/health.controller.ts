import { Controller, Get } from '@nestjs/common';

/*
  GET /api/health – "életjel". A tárhelyszolgáltatók (és te is) ezzel
  ellenőrizhetik, hogy fut-e az API.
*/
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', time: new Date().toISOString() };
  }
}
