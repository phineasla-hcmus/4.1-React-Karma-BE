import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class InterbankRequestDTO {
  @IsString()
  chuKy: string;

  @IsString()
  @IsNotEmpty()
  soTK: string;

  @IsISO8601()
  @IsNotEmpty()
  ngayTao: string;
}
