import {
  HttpStatus,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime';

import { formatResponse, PaginationDto } from '../pagination';
import { PrismaService } from '../prisma/prisma.service';

import { CreateExternalTransactionDto } from './dto/create-external-transaction.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionQueryDTO } from './dto/transactions.query.dto';
import { ExternalService } from '../external/external.service';

export enum Loai {
  transfer,
  receive,
}

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

  async create(
    dto: CreateTransactionDto,
    prismaService: PrismaClient | Prisma.TransactionClient = this.prismaService,
  ) {
    return prismaService.chuyenKhoanNoiBo.create({
      data: {
        taiKhoanChuyen: { connect: { soTK: dto.sender } },
        taiKhoanNhan: { connect: { soTK: dto.receiver } },
        soTien: dto.amount,
        noiDungCK: dto.message,
        loaiCK: dto.feeType,
        phiCK: dto.fee,
      },
    });
  }

  async createExternal(
    dto: CreateExternalTransactionDto,
    prismaService: PrismaClient | Prisma.TransactionClient = this.prismaService,
  ) {
    return prismaService.chuyenKhoanNganHangNgoai.create({
      data: {
        tkNgoai: dto.external,
        soTien: dto.amount,
        phiCK: dto.amount,
        noiDungCK: dto.message,
        loaiCK: dto.type,
        nganHangLK: {
          connect: { tenNH: dto.bank },
        },
        taiKhoan: {
          connect: { soTK: dto.internal },
        },
      },
    });
  }

  async getTransactions(id: string) {
    const current = new Date();
    const prior = new Date(new Date().setDate(current.getDate() - 30));
    const recvReminderTxn = await this.getRecvRemindersTransactions(id);
    const sendReminderTxn = await this.getSendRemindersTransactions(id);
    const externalRecv = await this.getRecvExternalTransaction(id);
    const externalSend = await this.getSendExternalTransaction(id);

    const recvList = await this.prismaService.chuyenKhoanNoiBo.findMany({
      where: {
        ngayCK: {
          gte: prior,
          lte: current,
        },
        nguoiNhan: id,
        maCK: {
          notIn: sendReminderTxn,
        },
      },
    });
    recvList.forEach(function (element) {
      element['loai'] = Loai.receive;
    });
    const sendList = await this.prismaService.chuyenKhoanNoiBo.findMany({
      where: {
        ngayCK: {
          gte: prior,
          lte: current,
        },
        nguoiChuyen: id,
        maCK: {
          notIn: recvReminderTxn,
        },
      },
    });
    sendList.forEach(function (element) {
      element['loai'] = Loai.transfer;
    });
    const list = [...recvList, ...sendList, ...externalRecv, ...externalSend];
    list.sort(function (a, b) {
      if (a['ngayCK'].getTime() - b['ngayCK'].getTime() > 0) return -1;
      if (a['ngayCK'].getTime() - b['ngayCK'].getTime() < 0) return 1;
      return 0;
    });
    return list;
  }

  async getRemindersTransactions(id: string) {
    const current = new Date();
    const prior = new Date(new Date().setDate(current.getDate() - 30));
    const recvReminderTxn = await this.getRecvRemindersTransactions(id);
    const sendReminderTxn = await this.getSendRemindersTransactions(id);

    const recvList = await this.prismaService.chuyenKhoanNoiBo.findMany({
      where: {
        ngayCK: {
          gte: prior,
          lte: current,
        },
        nguoiNhan: id,
        maCK: {
          in: sendReminderTxn,
        },
      },
    });
    recvList.forEach(function (element) {
      element['loai'] = Loai.receive;
    });
    const sendList = await this.prismaService.chuyenKhoanNoiBo.findMany({
      where: {
        ngayCK: {
          gte: prior,
          lte: current,
        },
        nguoiChuyen: id,
        maCK: {
          in: recvReminderTxn,
        },
      },
    });
    sendList.forEach(function (element) {
      element['loai'] = Loai.transfer;
    });
    const list = [...recvList, ...sendList];
    return list;
  }

  async getSendRemindersTransactions(soTK: string) {
    const txns = await this.prismaService.nhacNo.findMany({
      select: {
        chuyenKhoan: true,
      },
      where: {
        soTKNguoiGui: soTK,
      },
    });
    let ret = [];
    txns.forEach(function (element) {
      ret.push(element.chuyenKhoan);
    });
    return ret;
  }
  async getRecvRemindersTransactions(soTK: string) {
    const txns = await this.prismaService.nhacNo.findMany({
      select: {
        chuyenKhoan: true,
      },
      where: {
        soTKNguoiNhan: soTK,
      },
    });
    let ret = [];
    txns.forEach(function (element) {
      ret.push(element.chuyenKhoan);
    });
    return ret;
  }

  async getSendExternalTransaction(soTK: string) {
    const list = await this.prismaService.chuyenKhoanNganHangNgoai.findMany({
      where: {
        tkTrong: soTK,
        soTien: {
          lt: 0,
        },
      },
    });
    list.forEach(function (e) {
      e['loai'] = Loai.transfer;
      e.soTien = -1 * e.soTien;
      e['ngayCK'] = e.thoiGian;
      e['nguoiChuyen'] = e.tkTrong;
      e['nguoiNhan'] = e.tkNgoai;
      delete e.thoiGian;
      delete e.tkNgoai;
      delete e.tkTrong;
    });
    return list;
  }

  async getRecvExternalTransaction(soTK: string) {
    const list = await this.prismaService.chuyenKhoanNganHangNgoai.findMany({
      where: {
        tkTrong: soTK,
        soTien: {
          gt: 0,
        },
      },
    });
    list.forEach(function (e) {
      e['loai'] = Loai.receive;
      e.soTien = e.soTien;
      e['ngayCK'] = e.thoiGian;
      e['nguoiChuyen'] = e.tkNgoai;
      e['nguoiNhan'] = e.tkTrong;
      delete e.thoiGian;
      delete e.tkNgoai;
      delete e.tkTrong;
    });
    return list;
  }
}
