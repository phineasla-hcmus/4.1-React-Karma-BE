import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { UpdateBalanceDto } from './dto/update-balance.dto';

@Injectable()
export class PaymentAccountsService {
  constructor(private prismaService: PrismaService) {}

  async findOne(soTK: string) {
    return this.prismaService.taiKhoanThanhToan.findUnique({
      where: { soTK: soTK },
    });
  }

  /**
   * Find payment account belongs to an account
   */
  async findFirst(soTK: string, maTK: number) {
    return this.prismaService.taiKhoanThanhToan.findFirst({
      where: { soTK: soTK, maTK: maTK },
    });
  }

  async findOneInfo(soTK: string) {
    const user = await this.prismaService.taiKhoanThanhToan.findFirst({
      select: {
        soTK: true,
        taiKhoan: {
          select: {
            khachHang: {
              select: {
                hoTen: true,
              },
            },
          },
        },
      },
      where: {
        soTK,
        taiKhoan: {
          hoatDong: true,
        },
      },
    });

    if (user) {
      return {
        soTK: user.soTK,
        hoTen: user.taiKhoan.khachHang.hoTen,
      };
    }
    return null;
  }

  async increaseBalance(
    { soTK, amount: value }: UpdateBalanceDto,
    prismaService: PrismaClient | Prisma.TransactionClient = this.prismaService,
  ) {
    return prismaService.taiKhoanThanhToan.update({
      where: { soTK: soTK },
      data: {
        soDu: {
          increment: value,
        },
      },
    });
  }

  async decreaseBalance(
    { soTK, amount: value }: UpdateBalanceDto,
    prismaService: PrismaClient | Prisma.TransactionClient = this.prismaService,
  ) {
    return prismaService.taiKhoanThanhToan.update({
      where: { soTK: soTK },
      data: {
        soDu: {
          decrement: value,
        },
      },
    });
  }

  async getInfoByAccountNo(accountNo: string) {
    const account = await this.prismaService.taiKhoanThanhToan.findUnique({
      where: {
        soTK: accountNo,
      },
    });

    return account;
  }

  async deactivatePaymentAccount(soTK: string) {
    const isActive = await this.prismaService.taiKhoanThanhToan.findUnique({
      select: {
        hoatDong: true,
      },
      where: {
        soTK: soTK,
      },
    });
    if (!isActive) {
      throw new ForbiddenException({
        errorId: HttpStatus.FORBIDDEN,
        message: 'Payment account is inactive',
      });
    }
    await this.prismaService.taiKhoanThanhToan.update({
      where: {
        soTK: soTK,
      },
      data: {
        hoatDong: false,
      },
    });
  }
}
