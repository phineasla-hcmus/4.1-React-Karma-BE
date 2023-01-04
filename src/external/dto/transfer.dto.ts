import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class TransferDto {
  @IsNumber()
  otp: number;

  @IsNotEmpty()
  soTK: string;

  @IsNotEmpty()
  nganHang: string;

  @IsNotEmpty()
  nguoiNhan: string;

  @IsNumber()
  @Min(0)
  soTien: number;

  @IsNotEmpty()
  noiDung: string;

  @IsNotEmpty()
  hinhThuc: 'sender' | 'receiver';
}
