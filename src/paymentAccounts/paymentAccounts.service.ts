import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentAccountsService {
  constructor(private prismaService: PrismaService) {}

  async findOne(soTK: string) {
    return this.prismaService.taiKhoanThanhToan.findUnique({
      where: { soTK: soTK },
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
}
