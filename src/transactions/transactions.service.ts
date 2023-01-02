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
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  private readonly logger: Logger = new Logger(TransactionsService.name);

  constructor(private prismaService: PrismaService) {}

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

  async findAllWithPagination(pagination: PaginationDto) {
    let total;
    try {
      total = await this.prismaService.chuyenKhoanNoiBo.count();
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
      const data = await this.prismaService.chuyenKhoanNoiBo.findMany({
        skip: (pagination.page - 1) * pagination.size,
        take: pagination.size,
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
}
