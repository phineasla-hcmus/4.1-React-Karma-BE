import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindOneExternalDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nganHang: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
