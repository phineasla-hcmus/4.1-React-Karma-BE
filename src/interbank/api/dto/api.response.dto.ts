import { ApiProperty } from '@nestjs/swagger';

export class BaseApiResponseDto {
  @ApiProperty({
    description: 'ISO 8601',
    example: new Date().toISOString(),
  })
  ngayTao: string;

  @ApiProperty()
  chuKy: string;
}

export class GetAccountApiResponseDto extends BaseApiResponseDto {
  @ApiProperty({
    description: 'Account number',
  })
  soTK: string;

  @ApiProperty()
  hoTen: string;
}

export class TransferApiResponseDto extends BaseApiResponseDto {
  @ApiProperty({
    description: 'Transaction ID',
  })
  maCKN: number;

  @ApiProperty({
    description: "Amount transfered, this doesn't include fee incurred",
  })
  soTien: number;

  @ApiProperty({
    description: 'Fee',
  })
  phiCK: number;

  @ApiProperty({
    description: 'ISO 8601. Transaction time',
    example: new Date().toISOString(),
  })
  thoiGian: Date;
}
