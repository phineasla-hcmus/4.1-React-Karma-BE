import { IsNotEmpty, IsString } from 'class-validator';

export class FindOneAccountDto {
  @IsString()
  @IsNotEmpty()
  nganHang: string;

  @IsString()
  @IsNotEmpty()
  id: string;
}
