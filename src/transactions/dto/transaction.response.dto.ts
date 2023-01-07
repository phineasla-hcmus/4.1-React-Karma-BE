import { ApiProperty } from '@nestjs/swagger';

export class ResponseTransactionDto {
  @ApiProperty()
  maCK: number;

  @ApiProperty()
  nguoiChuyen: string;

  @ApiProperty()
  nguoiNhan: string;

  @ApiProperty()
  soTien: number;

  @ApiProperty()
  noiDungCK: string;

  @ApiProperty()
  ngayCK: string;

  @ApiProperty({ enum: ['sender', 'receiver'] })
  loaiCK: 'sender' | 'receiver';

  @ApiProperty()
  phiCK: number;

  @ApiProperty()
  id: number;
}

export class ResponseRequestDto {
  @ApiProperty()
  soTK: string;

  @ApiProperty()
  soTien: number;
}
