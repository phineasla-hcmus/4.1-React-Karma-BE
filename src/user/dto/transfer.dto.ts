import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';

import { FeeType } from '../../types';

export class LocalTransferDto {
  @ApiProperty()
  @IsNumber()
  otp: number;

  @ApiProperty()
  @IsNotEmpty()
  soTK: string;

  @ApiProperty()
  @IsNotEmpty()
  nguoiNhan: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  soTien: number;

  @ApiProperty()
  @IsNotEmpty()
  noiDung: string;

  @ApiProperty({ enum: FeeType })
  @IsEnum(FeeType)
  loaiCK: FeeType;
}
