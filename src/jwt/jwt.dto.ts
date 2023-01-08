import { VaiTro } from '@prisma/client';
import type { JwtPayload } from 'jsonwebtoken';

export class JwtUserDto {
  maTK: number;
  tenDangNhap: string;
  hoTen: string;
  vaiTro: VaiTro;
  refreshToken: string;
}

export class JwtPayloadDto extends JwtUserDto implements JwtPayload {}
