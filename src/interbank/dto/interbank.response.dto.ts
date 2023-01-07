import { ApiProperty } from '@nestjs/swagger';

export class InterbankResponseDto {
  @ApiProperty({
    description: 'Account number',
  })
  soTK: string;

  @ApiProperty({
    description: 'Created date',
  })
  ngayTao: string;

  @ApiProperty({
    description: 'signature',
  })
  chuKy: string;
}
