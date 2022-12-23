import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentAccountsService {
  constructor(private prismaService: PrismaService) {}

  public async getInfoByAccountNo(account_no: string) {
    const raw = await this.prismaService.taiKhoanThanhToan.findMany({
      select: {
        soTK: true,
        taiKhoan: {
          select: {
            khachHang: {
              select: {
                hoTen: true,
                sdt: true,
                email: true,
              },
            },
          },
        },
      },
      where: {
        soTK: account_no,
        taiKhoan: {
          hoatDong: true,
        },
      },
    });
    return raw[0];
  }
}
