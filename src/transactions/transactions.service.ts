import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { formatResponse, PaginationDto } from '../pagination';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prismaService: PrismaService) {}

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
      transactionList = await this.prismaService.chuyenKhoanNoiBo.findMany({
        skip: (pagination.page - 1) * pagination.size,
        take: pagination.size,
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
