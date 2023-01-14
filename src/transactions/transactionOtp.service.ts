import { randomInt } from 'crypto';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { otpChuyenKhoan, Prisma, PrismaClient } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime';

import { TRANSACTION_OTP_TTL } from '../constants';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionOtpService {
  private readonly logger: Logger = new Logger(TransactionOtpService.name);

  constructor(private prismaService: PrismaService) {}

  private didReceiveError(e: unknown) {
    if (e instanceof PrismaClientKnownRequestError) {
      this.logger.error(`${e.code}: ${e.message}`, e.stack);
    } else if (e instanceof PrismaClientUnknownRequestError) {
      this.logger.error(e.message, e.stack);
    } else {
      this.logger.error(e);
    }
    return new InternalServerErrorException({
      errorId: 'database_error',
      message: 'Cannot create OTP token',
    });
  }

  async findOne(soTK: string) {
    return this.prismaService.otpChuyenKhoan
      .findUnique({
        where: { soTK },
      })
      .catch((e) => {
        throw this.didReceiveError(e);
      });
  }

  verify(target: Omit<otpChuyenKhoan, 'ngayTao'>, source: otpChuyenKhoan) {
    return (
      target &&
      source &&
      target.otp === source.otp &&
      Date.now() - source.ngayTao.getTime() < TRANSACTION_OTP_TTL &&
      target.soTK === source.soTK &&
      target.nguoiNhan === source.nguoiNhan &&
      target.soTien === source.soTien
    );
  }

  async upsert(data: Omit<otpChuyenKhoan, 'ngayTao' | 'otp'>) {
    const otp = randomInt(100001, 999999);
    // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#unique-key-constraint-errors-on-upserts
    return this.prismaService.otpChuyenKhoan
      .upsert({
        where: { soTK: data.soTK },
        update: { ...data, otp, ngayTao: new Date() },
        create: { ...data, otp },
      })
      .catch((e) => {
        const httpError = this.didReceiveError(e);
        if (e instanceof PrismaClientKnownRequestError && e.code === 'P2003') {
          throw new NotFoundException({
            errorId: 'party_not_found',
            message: 'Cannot find receiver or sender ID',
          });
        }
        throw httpError;
      });
  }

  async delete(
    soTK: string,
    prismaService: PrismaClient | Prisma.TransactionClient = this.prismaService,
  ) {
    return prismaService.otpChuyenKhoan
      .delete({ where: { soTK } })
      .catch((e) => {
        throw this.didReceiveError(e);
      });
  }
}
