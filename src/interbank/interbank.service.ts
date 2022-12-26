import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaymentAccountsService } from 'src/paymentAccounts/paymentAccounts.service';
import { formatResponse, PaginationDto } from '../pagination';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InterbankService {
  constructor(
    private prismaService: PrismaService,
    private paymentAccountService: PaymentAccountsService,
  ) {}
  async getPaymentAccountInfo(account_no: string) {
    return await this.paymentAccountService.getInfoByAccountNo(account_no);
  }
  async findAllWithoutPagination() {
    try {
      const data = await this.prismaService.chuyenKhoanNganHangNgoai.findMany({
        include: {
          nganHangLK: true,
        },
      });
      return data.map(({ ...props }) => ({
        ...props,
        id: props.maCKN,
      }));
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException({
          errorId: e.name,
          message: e.message,
          stack: e.stack,
        });
      }
    }
  }

  async findAllWithPagination(pagination: PaginationDto) {
    let total;
    try {
      total = await this.prismaService.chuyenKhoanNganHangNgoai.count();
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException({
          errorId: 'database_error',
          message: e.message,
          stack: e.stack,
        });
      }
      throw e;
    }
    let interbankList;
    try {
      interbankList =
        await this.prismaService.chuyenKhoanNganHangNgoai.findMany({
          skip: (pagination.page - 1) * pagination.size,
          take: pagination.size,
          include: {
            nganHangLK: true,
          },
        });
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException({
          errorId: e.name,
          message: e.message,
          stack: e.stack,
        });
      }
    }
    const lastPage = Math.ceil(total / pagination.size);

    return formatResponse(
      pagination,
      total,
      lastPage,
      interbankList,
      'interbank',
    );
  }

  //id: mã chuyển khoản
  async findOne(id: number) {
    try {
      return await this.prismaService.chuyenKhoanNganHangNgoai.findUnique({
        where: {
          maCKN: id,
        },
        include: {
          nganHangLK: true,
        },
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException({
          errorId: e.name,
          message: e.message,
          stack: e.stack,
        });
      }
    }
  }

  async findStatistic() {
    const statistic = {
      soTienGui: 0,
      soTienNhan: 0,
    };
    let sent, received;
    try {
      sent = await this.prismaService.chuyenKhoanNganHangNgoai.aggregate({
        _sum: {
          soTien: true,
        },
        where: {
          soTien: { lt: 0 },
        },
      });
      received = await this.prismaService.chuyenKhoanNganHangNgoai.aggregate({
        _sum: {
          soTien: true,
        },
        where: {
          soTien: {
            gt: 0,
          },
        },
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException({
          errorId: e.name,
          message: e.message,
          stack: e.stack,
        });
      }
    }
    statistic.soTienGui = -sent._sum.soTien;
    statistic.soTienNhan = received._sum.soTien;
    return statistic;
  }
}
