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

  @ApiProperty({
    description: 'ISO 8601',
    example: new Date().toISOString(),
  })
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
  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  nguoiNhan: string;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  nguoiChuyen: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  soTien: number;

  @ApiProperty()
  @IsString()
  noiDungCK: string;

  @ApiProperty({ enum: FeeType })
  @IsEnum(FeeType)
  loaiCK: FeeType;
}
