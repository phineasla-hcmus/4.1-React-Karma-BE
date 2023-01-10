import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsISO8601,
  IsNumberString,
  IsNumber,
  IsEnum,
} from 'class-validator';

import { FeeType } from '../../../types';

export class BaseApiDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tenNH: string;

  @ApiProperty()
  @IsISO8601()
  @IsNotEmpty()
  ngayTao: string;

  @ApiProperty()
  @IsString()
  chuKy: string;
}

export class GetAccountApiDto extends BaseApiDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  soTK: string;
}

export class TransferApiDto extends BaseApiDto {
  @IsNumberString()
  @IsNotEmpty()
  nguoiNhan: string;

  @IsNumberString()
  @IsNotEmpty()
  nguoiChuyen: string;

  @IsNumber()
  @IsNotEmpty()
  soTien: number;

  @IsString()
  noiDungCK: string;

  @IsEnum(FeeType)
  loaiCK: FeeType;
}
