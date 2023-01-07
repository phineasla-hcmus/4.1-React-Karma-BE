import { PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { CreateContactDto } from './create-contact.dto';

export class UpdateContactDto extends PickType(CreateContactDto, [
  'tenGoiNho',
] as const) {
  @IsNotEmpty()
  tenGoiNho: string;
}
