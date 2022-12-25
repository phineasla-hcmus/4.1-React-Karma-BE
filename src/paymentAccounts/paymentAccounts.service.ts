import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
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
    const user = raw[0];

    if (user) {
      return {
        soTK: user.soTK,
        hoTen: user.taiKhoan.khachHang.hoTen,
      };
    }
    return null;
  }
}
