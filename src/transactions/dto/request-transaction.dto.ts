import { ApiProperty } from '@nestjs/swagger';

export class RequestTransactionDto {
  soTK: string;
  nguoiNhan: string;
  soTien: number;
}
