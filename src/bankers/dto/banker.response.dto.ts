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

export class BankerResponseDto {
  @ApiProperty()
  maTK: number;

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

  @ApiProperty({ description: 'Mã tài khoản' })
  id: number;
}

export class UpdateBankerResponseDto {
  @ApiProperty({ description: 'Profile of a banker' })
  data: BankerDto;

  @ApiProperty({ description: 'Mã tài khoản' })
  id: number;
}
