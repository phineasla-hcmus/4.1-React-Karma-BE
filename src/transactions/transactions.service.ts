import {
  HttpStatus,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime';

import { formatResponse, PaginationDto } from '../pagination';
import { PrismaService } from '../prisma/prisma.service';

import { CreateExternalTransactionDto } from './dto/create-external-transaction.dto';
import { TransactionQueryDTO } from './dto/transactions.query.dto';

@Injectable()
export class TransactionsService {
  private readonly logger: Logger = new Logger(TransactionsService.name);

  constructor(private prismaService: PrismaService) {}

  private didReceiveError(e: unknown) {
    if (e instanceof PrismaClientKnownRequestError) {
      this.logger.error(`${e.code}: ${e.message}`, e.stack);
    } else if (e instanceof PrismaClientUnknownRequestError) {
      this.logger.error(e.message, e.stack);
    } else {
      this.logger.error(e);
    }
    return e;
  }

  async findAllWithoutPagination() {
    try {
      const data = await this.prismaService.chuyenKhoanNoiBo.findMany({});
      return data.map(({ ...props }) => ({
        ...props,
        id: props.maCK,
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

  async getQuery(query: string) {
    if (query.length == 8) {
      try {
        const accountNum = await this.prismaService.taiKhoan.findUnique({
          where: {
            tenDangNhap: query,
          },
          select: {
            taiKhoanThanhToan: {
              select: {
                soTK: true,
              },
            },
          },
        });
        if (!accountNum) {
          throw new BadRequestException({
            errorId: HttpStatus.NOT_FOUND,
            message: 'Account not found',
          });
        }
        return accountNum.taiKhoanThanhToan.soTK;
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
    }
    return query;
  }

  async findAllWithPagination(
    pagination: PaginationDto,
    query: TransactionQueryDTO,
  ) {
    let total;
    let data;
    let senderKey, receiverKey;
    if (query.receiver) {
      receiverKey = await this.getQuery(query.receiver);
    }
    if (query.sender) {
      senderKey = await this.getQuery(query.sender);
    }

    try {
      total = await this.prismaService.chuyenKhoanNoiBo.count({
        where: {
          AND: [{ nguoiNhan: receiverKey }, { nguoiChuyen: senderKey }],
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

    let transactionList;
    try {
      data = await this.prismaService.chuyenKhoanNoiBo.findMany({
        skip: (pagination.page - 1) * pagination.size,
        take: pagination.size,
        where: {
          AND: [{ nguoiNhan: receiverKey }, { nguoiChuyen: senderKey }],
        },
        distinct: ['maCK'],
        orderBy: {
          ngayCK: 'desc',
        },
      });

      transactionList = data.map(({ ...props }) => ({
        ...props,
        id: props.maCK,
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
      transactionList,
      'transactions',
    );
  }

  //id: mã chuyển khoản
  async findOne(id: number) {
    try {
      return await this.prismaService.chuyenKhoanNoiBo.findUnique({
        where: {
          maCK: id,
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

  async createExternal(dto: CreateExternalTransactionDto) {
    return this.prismaService.chuyenKhoanNganHangNgoai.create({
      data: {
        tkNgoai: dto.tkNgoai,
        soTien: dto.soTien,
        noiDungCK: dto.noiDungCK,
        nganHangLK: {
          connect: { tenNH: dto.nganHang },
        },
        taiKhoan: {
          connect: { soTK: dto.tkTrong },
        },
      },
    });
  }
}
