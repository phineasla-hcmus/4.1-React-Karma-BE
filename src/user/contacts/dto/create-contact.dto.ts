import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty()
  @ApiProperty()
  nguoiDung: string;

  @ApiProperty()
  tenGoiNho: string;
}
