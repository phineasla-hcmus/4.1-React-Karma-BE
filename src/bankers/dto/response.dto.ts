import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
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

  // @ApiProperty()
  // nhanVien: {
  //   maNV: number;
  //   hoTen: string;
  //   sdt: string;
  //   maTK: number;
  // };

  @ApiProperty()
  id: number;
}
