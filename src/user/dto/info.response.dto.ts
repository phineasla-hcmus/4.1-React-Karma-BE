import { ApiProperty } from '@nestjs/swagger';

class PaymentInfoResponseDto {
  @ApiProperty()
  soTK: string;

  @ApiProperty()
  soDu: number;

  @ApiProperty()
  maTK: number;

  @ApiProperty()
  hoatDong: boolean;
}

export class InfoResponseDto {
  @ApiProperty()
  hoTen: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  sdt: string;

  @ApiProperty()
  soTK: string;

  @ApiProperty()
  soDu: number;

  @ApiProperty({ type: PaymentInfoResponseDto })
  taiKhoanThanhToan: PaymentInfoResponseDto;
}
