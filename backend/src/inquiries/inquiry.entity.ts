import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import type { InquiryStatus, InquiryType } from './inquiry.types';

/*
  Entity = egy adatbázis-tábla leírása TypeScript osztályként.
  A TypeORM ebből hozza létre a táblát (DB_SYNC=true esetén), és ebből
  tudja, hogyan alakítsa a sorokat objektummá és vissza.

  Szándékosan 'varchar' típusokat használunk (nem adatbázis-enumot),
  hogy SQLite-on és PostgreSQL-en is ugyanúgy működjön.
*/
@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 20 })
  type!: InquiryType;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 200 })
  email!: string;

  @Column({ type: 'varchar', length: 40, default: '' })
  phone!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'varchar', length: 20, default: 'uj' })
  status!: InquiryStatus;

  @CreateDateColumn()
  createdAt!: Date;
}
