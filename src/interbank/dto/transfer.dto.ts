import {
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';

export class transferDTO {
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

  @IsISO8601()
  @IsNotEmpty()
  ngayTao: string;

  @IsString()
  @IsNotEmpty()
  chuKy: string;
}
