import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';

import { FeeType } from '../../types';

export class TransferDto {
  @IsNumber()
  otp: number;

  @IsNotEmpty()
  soTK: string;

  @IsNotEmpty()
  nguoiNhan: string;

  @IsNumber()
  @Min(0)
  soTien: number;

  @IsNotEmpty()
  noiDung: string;

  @IsEnum(FeeType)
  loaiCK: FeeType;
}
