import { ApiProperty } from '@nestjs/swagger';

export class BankResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  tenNH: string;
}
