import { ApiProperty } from '@nestjs/swagger';

export class BankResponseDto {
  @ApiProperty()
  maNH: number;

  @ApiProperty()
  id: number;

  @ApiProperty()
  tenNH: string;

  @ApiProperty()
  kPublic: string;

  @ApiProperty()
  coCheBaoMat: number;
}
