import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class InterbankRequestDto {
  @ApiProperty()
  @IsString()
  chuKy: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  soTK: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tenNH: string;

  @ApiProperty()
  @IsISO8601()
  @IsNotEmpty()
  ngayTao: string;
}
