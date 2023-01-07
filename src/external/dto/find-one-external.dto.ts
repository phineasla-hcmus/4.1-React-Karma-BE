import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindOneExternalDto {
  @ApiProperty({ example: 'HCMBank' })
  @IsString()
  @IsNotEmpty()
  nganHang: string;

  @ApiProperty({ description: 'HCMBank account number' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
