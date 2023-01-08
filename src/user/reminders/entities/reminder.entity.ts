import { ApiProperty } from '@nestjs/swagger';
import { TrangThaiNhacNo } from '@prisma/client';

export class Reminder {
  @ApiProperty()
  maNN: number;

  @ApiProperty()
  nguoiGui: string;

  @ApiProperty()
  soTKNguoiGui: string;

  @ApiProperty()
  nguoiNhan: string;

  @ApiProperty()
  soTien: number;

  @ApiProperty()
  ngayTao: Date;

  @ApiProperty()
  noiDungNN: string;

  @ApiProperty({ enum: TrangThaiNhacNo })
  trangThai: TrangThaiNhacNo;

  @ApiProperty()
  noiDungXoa: string;
}
