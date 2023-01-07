import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { VaiTro } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDTO) {
    const account = await this.prismaService.taiKhoan.findFirst({
      where: {
        tenDangNhap: loginDto.tenDangNhap,
        hoatDong: true,
      },
    });

    if (!account)
      throw new ForbiddenException({
        errorId: HttpStatus.UNAUTHORIZED,
        message: 'Access Denied',
      });

    const hoTen = await this.getName(account.maTK, account.vaiTro);
    const passwordMatch = await bcrypt.compare(
      loginDto.matKhau,
      account.matKhau,
    );

    if (!passwordMatch)
      throw new ForbiddenException({
        errorId: HttpStatus.UNAUTHORIZED,
        message: 'Access Denied',
      });

    const tokens = await this.getTokens(
      account.maTK,
      account.tenDangNhap,
      account.vaiTro,
      hoTen,
    );

    await this.saveRtHash(account.maTK, tokens.refreshToken);
    return tokens;
  }

  async logout(maTK: number) {
    await this.prismaService.taiKhoan.updateMany({
      where: {
        maTK: maTK,
        refreshToken: {
          not: null,
        },
      },
      data: {
        refreshToken: null,
      },
    });
  }

  async refreshTokens(maTK: number, rt: string) {
    const account = await this.prismaService.taiKhoan.findFirst({
      where: {
        maTK: maTK,
        hoatDong: true,
      },
    });
    if (!account)
      throw new ForbiddenException({
        errorId: HttpStatus.UNAUTHORIZED,
        message: 'Access Denied',
      });
    const hoTen = await this.getName(maTK, account.vaiTro);
    const rtMatch = await bcrypt.compare(rt, account.refreshToken);
    if (!rtMatch)
      throw new ForbiddenException({
        errorId: HttpStatus.UNAUTHORIZED,
        message: 'Access Denied',
      });

    const tokens = await this.getTokens(
      maTK,
      account.tenDangNhap,
      account.vaiTro,
      hoTen,
    );
    await this.saveRtHash(maTK, tokens.refreshToken);
    return tokens;
  }

  async getTokens(
    maTK: number,
    tenDangNhap: string,
    vaiTro: VaiTro,
    hoTen: string,
  ) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: maTK,
          tenDangNhap,
          hoTen,
          vaiTro,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: maTK,
          tenDangNhap,
          hoTen,
          vaiTro,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  async saveRtHash(maTK: number, rt: string) {
    const hash = await bcrypt.hash(rt, 10);
    await this.prismaService.taiKhoan.update({
      where: {
        maTK: maTK,
      },
      data: {
        refreshToken: hash,
      },
    });
  }

  async getName(maTK: number, role: VaiTro) {
    if (role == VaiTro.Admin) return 'Admin';
    else if (role == VaiTro.Banker) {
      const banker = await this.prismaService.nhanVien.findUnique({
        select: {
          hoTen: true,
        },
        where: {
          maTK: maTK,
        },
      });
      return banker.hoTen;
    } else if (role == VaiTro.User) {
      const user = await this.prismaService.khachHang.findUnique({
        select: {
          hoTen: true,
        },
        where: {
          maTK: maTK,
        },
      });
      return user.hoTen;
    }
  }
}
