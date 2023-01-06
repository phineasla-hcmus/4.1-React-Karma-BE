import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, IsEnum } from 'class-validator';

import { FeeType } from '../../types';

export class TransferDto {
  @ApiProperty()
  @IsNumber()
  otp: number;

  @ApiProperty()
  @IsNotEmpty()
  soTK: string;

  @ApiProperty()
  @IsNotEmpty()
  nganHang: string;

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

  @IsEnum(FeeType)
  loaiCK: FeeType;
}
