import { ApiProperty } from '@nestjs/swagger';

class BankerDto {
  @ApiProperty()
  maNV: number;

  @ApiProperty()
  hoTen: string;

  @ApiProperty()
  sdt: string;

  @ApiProperty()
  maTK: number;
}

export class CreateBankerResponseDto {
  @ApiProperty()
  maTK: number;
  hoTen: string;
  sdt: string;
  @ApiProperty()
  tenDangNhap: string;

  @ApiProperty()
  matKhau: string;

  @ApiProperty()
  vaiTro: string;

  @ApiProperty()
  refreshToken: null | string;

  @ApiProperty()
  hoatDong: boolean;

  @ApiProperty()
  nhanVien: BankerDto;

  @ApiProperty()
  id: number;
}
