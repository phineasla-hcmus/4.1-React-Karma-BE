import { IsNotEmpty, IsString } from 'class-validator';

export class FindOneExternalDto {
  @IsString()
  @IsNotEmpty()
  nganHang: string;

  @IsString()
  @IsNotEmpty()
  id: string;
}
