import { ApiProperty } from '@nestjs/swagger';

export class InterbankResponseDto {
  @ApiProperty({
    description: 'Account number',
  })
  soTK: string;

  @ApiProperty()
  hoTen: string;

  @ApiProperty({
    description: 'Created date',
  })
  ngayTao: string;

  @ApiProperty({
    description: 'Signature',
  })
  chuKy: string;
}

export class InterbankTransferResponseDto {
  @ApiProperty()
  maCKN: number;

  @ApiProperty()
  id: number;

  @ApiProperty()
  tkTrong: string;

  @ApiProperty()
  tkNgoai: string;

  @ApiProperty()
  soTien: number;

  @ApiProperty()
  maNganHang: number;

  @ApiProperty()
  noiDungCK: string;

  @ApiProperty()
  thoiGian: string;

  @ApiProperty({
    description: 'To know which sender or receiver pay the transfer fee',
    enum: ['sender', 'receiver'],
  })
  loaiCK: string;

  @ApiProperty()
  phiCK: number;
}

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
