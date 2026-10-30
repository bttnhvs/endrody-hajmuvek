import { Transform } from 'class-transformer';
import {
  Equals,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { INQUIRY_TYPES, type InquiryType } from '../inquiry.types';

/** Szóközök levágása a szöveges mezők elejéről-végéről. */
const trim = () =>
  Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value));

/*
  DTO (Data Transfer Object) – leírja, milyen adatot fogad el a végpont.

  A dekorátorok a szabályok. A frontend is validál, de a backendnek
  MINDIG újra kell: a böngészőt meg lehet kerülni (pl. curl-lel bárki
  küldhet bármit). A hibaüzenetek magyarul mennek vissza.

  Figyeld meg a párhuzamot az Angular Validators-szal:
    Validators.required + minLength(2)  ↔  @Length(2, 100)
    Validators.email                    ↔  @IsEmail()
    Validators.requiredTrue             ↔  @Equals(true)
*/
export class CreateInquiryDto {
  @IsIn(INQUIRY_TYPES, { message: 'Ismeretlen ajánlatkérés-típus.' })
  type!: InquiryType;

  @trim()
  @IsString()
  @Length(2, 100, { message: 'A név 2–100 karakter legyen.' })
  name!: string;

  @trim()
  @IsEmail({}, { message: 'Érvényes e-mail-címet adj meg.' })
  @MaxLength(200)
  email!: string;

  @trim()
  @IsOptional()
  @IsString()
  @Matches(/^[0-9+()\-\s]{0,40}$/, { message: 'A telefonszám csak számokat, szóközt, +, -, ( ) jelet tartalmazhat.' })
  phone?: string;

  @trim()
  @IsString()
  @Length(10, 3000, { message: 'Az üzenet 10–3000 karakter legyen.' })
  message!: string;

  @Equals(true, { message: 'Az adatkezelési hozzájárulás kötelező.' })
  consent!: boolean;

  /*
    "Mézesbödön" (honeypot) mező a spam ellen: a weboldalon el van rejtve,
    egy ember tehát üresen hagyja. Az automata spamrobotok viszont minden
    mezőt kitöltenek – ha ez nem üres, a kérést csendben eldobjuk.
  */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;
}
