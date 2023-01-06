import { ApiProperty } from '@nestjs/swagger';

export class RequestTransactionDto {
  @ApiProperty()
  soTK: string;

  @ApiProperty()
  nguoiNhan: string;

  @ApiProperty()
  soTien: number;
}
