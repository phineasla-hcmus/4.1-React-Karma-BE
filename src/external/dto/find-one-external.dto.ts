import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindOneExternalDto {
  @ApiProperty({ example: 'HCMUSBank' })
  @IsString()
  @IsNotEmpty()
  nganHang: string;

  @ApiProperty({ description: 'External bank account number' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
