import {
  IsDate,
  IsDateString,
  IsISO8601,
  IsNotEmpty,
  IsString,
  isISO8601,
} from 'class-validator';

export class InterbankRequestDTO {
  @IsString()
  @IsNotEmpty()
  soTK: string;

  @IsISO8601()
  @IsNotEmpty()
  ngayTao: string;

  // @IsString()
  // chuKy: string;
}
