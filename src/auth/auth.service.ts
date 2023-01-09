import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { VaiTro } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from '../constants';
import { PrismaService } from '../prisma/prisma.service';

import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async login(loginDto: LoginDTO) {
    const account = await this.findAccountWithRole(
      loginDto.tenDangNhap,
      VaiTro.User,
    );

    if (!account)
      throw new ForbiddenException({
        errorId: HttpStatus.UNAUTHORIZED,
        message: 'Username or password is invalid',
      });

    const hoTen = await this.getName(account.maTK, account.vaiTro);
    const passwordMatch = await bcrypt.compare(
      loginDto.matKhau,
      account.matKhau,
    );

    if (!passwordMatch)
      throw new ForbiddenException({
        errorId: HttpStatus.UNAUTHORIZED,
        message: 'Username or password is invalid',
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

  async adminLogin(loginDto: LoginDTO) {
    const account = await this.findAccountWithRole(
      loginDto.tenDangNhap,
      VaiTro.Admin,
    );

    if (!account)
      throw new ForbiddenException({
        errorId: HttpStatus.UNAUTHORIZED,
        message: 'Username or password is invalid',
      });

    const hoTen = await this.getName(account.maTK, account.vaiTro);
    const passwordMatch = await bcrypt.compare(
      loginDto.matKhau,
      account.matKhau,
    );

    if (!passwordMatch)
      throw new ForbiddenException({
        errorId: HttpStatus.UNAUTHORIZED,
        message: 'Username or password is invalid',
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

  async bankerLogin(loginDto: LoginDTO) {
    const account = await this.findAccountWithRole(
      loginDto.tenDangNhap,
      VaiTro.Banker,
    );

    if (!account || !(await bcrypt.compare(loginDto.matKhau, account.matKhau)))
      throw new ForbiddenException({
        errorId: HttpStatus.UNAUTHORIZED,
        message: 'Username or password is invalid',
      });

    const hoTen = await this.getName(account.maTK, account.vaiTro);

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
    if (!account || !account.refreshToken)
      throw new ForbiddenException({
        errorId: HttpStatus.FORBIDDEN,
        message: 'Access Denied',
      });
    const hoTen = await this.getName(maTK, account.vaiTro);
    const rtMatch = await bcrypt.compare(rt, account.refreshToken);
    if (!rtMatch)
      throw new ForbiddenException({
        errorId: HttpStatus.FORBIDDEN,
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
          maTK: maTK,
          tenDangNhap,
          hoTen,
          vaiTro,
        },
        {
          secret: this.configService.getOrThrow('AT_SECRET'),
          expiresIn: ACCESS_TOKEN_TTL,
        },
      ),
      this.jwtService.signAsync(
        {
          maTK: maTK,
          tenDangNhap,
          hoTen,
          vaiTro,
        },
        {
          secret: this.configService.getOrThrow('RT_SECRET'),
          expiresIn: REFRESH_TOKEN_TTL,
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

  async findAccountWithRole(username: string, role: VaiTro) {
    const account = await this.prismaService.taiKhoan.findFirst({
      where: {
        tenDangNhap: username,
        hoatDong: true,
        vaiTro: role,
      },
    });
    return account;
  }
}
