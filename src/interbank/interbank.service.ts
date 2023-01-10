import {
  BadRequestException,
  HttpStatus,
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

import { InterbankTransactionQueryDto } from './dto/query.dto';
import { transferDTO } from './dto/transfer.dto';

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
    return await this.paymentAccountService.findOneInfo(soTK);
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

  async findAllWithPagination(
    pagination: PaginationDto,
    query: InterbankTransactionQueryDto,
  ) {
    const from = query.from ? new Date(query.from) : undefined;
    const to = query.to ? new Date(query.to) : undefined;
    const maNH = +query.bankID || undefined;

    let total;
    try {
      total = await this.prismaService.chuyenKhoanNganHangNgoai.count({
        where: {
          thoiGian: {
            gte: from,
            lte: to,
          },
          maNganHang: maNH,
        },
      });
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
        where: {
          thoiGian: {
            gte: from,
            lte: to,
          },
          maNganHang: maNH,
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
    const res = formatResponse(
      pagination,
      total,
      lastPage,
      interbankList,
      'interbank',
    );
    try {
      const [sent, received] = [
        await this.prismaService.chuyenKhoanNganHangNgoai.aggregate({
          _sum: { soTien: true },
          where: {
            soTien: {
              lt: 0,
            },
            thoiGian: {
              gte: from,
              lte: to,
            },
            maNganHang: maNH,
          },
        }),
        await this.prismaService.chuyenKhoanNganHangNgoai.aggregate({
          _sum: { soTien: true },
          where: {
            soTien: { gt: 0 },
            thoiGian: {
              gte: from,
              lte: to,
            },
            maNganHang: maNH,
          },
        }),
      ];
      res['soTienGui'] = 0 - sent._sum.soTien;
      res['soTienNhan'] = 0 + received._sum.soTien;
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException({
          errorId: e.name,
          message: e.message,
          stack: e.stack,
        });
      }
    }
    return res;
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

  async externalBankTransfer(transferDto: transferDTO, bankId: number) {
    const user = await this.paymentAccountService.getInfoByAccountNo(
      transferDto.nguoiNhan,
    );

    if (!user) {
      throw new BadRequestException({
        errorId: HttpStatus.NOT_FOUND,
        message: 'Account not found',
      });
    }

    try {
      const [transaction, account] = await this.prismaService.$transaction([
        this.prismaService.chuyenKhoanNganHangNgoai.create({
          data: {
            tkNgoai: transferDto.nguoiChuyen,
            tkTrong: transferDto.nguoiNhan,
            noiDungCK: transferDto.noiDungCK,
            soTien: transferDto.soTien,
            maNganHang: bankId,
          },
          select: {
            maCKN: true,
            soTien: true,
          },
        }),
        this.prismaService.taiKhoanThanhToan.update({
          data: {
            soDu: user.soDu + transferDto.soTien,
          },
          where: {
            soTK: transferDto.nguoiNhan,
          },
        }),
      ]);
      return transaction;
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException({
          errorId: e.name,
          message: e.message,
        });
      }
    }
  }

  async getBanksList() {
    return await this.prismaService.nganHangLienKet.findMany();
  }
}
