import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime';

import { formatResponse, PaginationDto } from '../pagination';
import { PaymentAccountsService } from '../paymentAccounts/paymentAccounts.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InterbankService {
  private readonly logger: Logger = new Logger(InterbankService.name);

  constructor(
    private prismaService: PrismaService,
    private paymentAccountService: PaymentAccountsService,
  ) {}

  private handleError(e: unknown) {
    if (e instanceof PrismaClientKnownRequestError) {
      this.logger.error(`${e.code}: ${e.message}`, e.stack);
    } else if (e instanceof PrismaClientUnknownRequestError) {
      this.logger.error(e.message, e.stack);
    } else {
      this.logger.error(e);
    }
    throw e;
  }

  async getPaymentAccountInfo(soTK: string) {
    return await this.paymentAccountService.getInfoByAccountNo(soTK);
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
      const data = await this.prismaService.chuyenKhoanNganHangNgoai.findMany({
        skip: (pagination.page - 1) * pagination.size,
        take: pagination.size,
        include: {
          nganHangLK: true,
        },
      });
      interbankList = data.map(({ ...props }) => ({
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
    const lastPage = Math.ceil(total / pagination.size);

    return formatResponse(
      pagination,
      total,
      lastPage,
      interbankList,
      'interbank',
    );
  }

  /**
   * @param id maCKN
   */
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
    try {
      const [sent, received] = await Promise.all([
        this.prismaService.chuyenKhoanNganHangNgoai.aggregate({
          _sum: {
            soTien: true,
          },
          where: {
            soTien: { lt: 0 },
          },
        }),
        this.prismaService.chuyenKhoanNganHangNgoai.aggregate({
          _sum: {
            soTien: true,
          },
          where: {
            soTien: {
              gt: 0,
            },
          },
        }),
      ]);
      return { soTienGui: -sent._sum.soTien, soTienNhan: received._sum.soTien };
    } catch (e) {
      this.handleError(e);
    }
  }
}
