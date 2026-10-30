import { mkdirSync } from 'node:fs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { InquiriesModule } from './inquiries/inquiries.module';
import { Inquiry } from './inquiries/inquiry.entity';

/*
  Gyökérmodul. Ha ismerős: a Nest modulrendszere az Angular régi
  NgModule-jaira épül – `imports`, `controllers`, `providers`.
*/
@Module({
  imports: [
    // .env beolvasása; isGlobal: bármelyik modulban injektálható a ConfigService
    ConfigModule.forRoot({ isGlobal: true }),

    /*
      Adatbázis. forRootAsync: a beállításokat a ConfigService-ből olvassa,
      ezért egy "factory" függvényt adunk meg, amibe a Nest beinjektálja.
      - van DATABASE_URL → PostgreSQL (éleshez)
      - nincs → SQLite fájl (fejlesztéshez, semmit nem kell telepíteni)
    */
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const synchronize = config.get<string>('DB_SYNC', 'true') === 'true';
        const url = config.get<string>('DATABASE_URL');

        if (url) {
          return {
            type: 'postgres',
            url,
            entities: [Inquiry],
            synchronize,
            ssl: url.includes('localhost') ? false : { rejectUnauthorized: false },
          };
        }

        mkdirSync('data', { recursive: true });
        return {
          // sql.js: tisztán JavaScriptben futó SQLite – Windowson sem kell hozzá fordítani semmit
          type: 'sqljs',
          location: 'data/hajmuvek.sqlite',
          autoSave: true,
          entities: [Inquiry],
          synchronize,
        };
      },
    }),

    /*
      Kérés-korlátozás (rate limiting): egy IP-címről legfeljebb 60 kérés percenként.
      Az ajánlatkérés végpontján ennél szigorúbb a limit (lásd a controllert).
    */
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),

    InquiriesModule,
  ],
  controllers: [HealthController],
  providers: [
    // A ThrottlerGuard így minden végpontra érvényes ("globális guard")
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
