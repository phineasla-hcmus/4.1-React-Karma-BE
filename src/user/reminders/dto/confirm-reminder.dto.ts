import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

import { FeeType } from '../../../types';

export class ConfirmReminderDto {
  @ApiProperty()
  @IsNumber()
  otp: number;

  @ApiProperty()
  @IsNotEmpty()
  noiDung: string;

  @ApiProperty({ enum: FeeType })
  @IsEnum(FeeType)
  loaiCK: FeeType;
}
