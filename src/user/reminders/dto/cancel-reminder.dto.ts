import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CancelReminderDto {
  @ApiProperty()
  @IsNotEmpty()
  noiDungXoa: string;
}
