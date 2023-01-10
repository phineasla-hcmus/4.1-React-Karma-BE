import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  RequestTimeoutException,
} from '@nestjs/common';
import { nganHangLienKet } from '@prisma/client';

import { BanksService } from '../../banks/banks.service';
import { API_TIMEOUT, FEE } from '../../constants';
import { CryptographyService } from '../../cryptography/cryptography.service';
import { PaymentAccountsService } from '../../paymentAccounts/paymentAccounts.service';
import { PrismaService } from '../../prisma/prisma.service';
import { FeeType } from '../../types';

import { BaseApiDto, GetAccountApiDto, TransferApiDto } from './dto/api.dto';

@Injectable()
export class InterbankApiService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly banksService: BanksService,
    private readonly paymenAccountsService: PaymentAccountsService,
    private readonly cryptographyService: CryptographyService,
  ) {}

  private async verifyRequest(request: BaseApiDto, bank: nganHangLienKet) {
    const { chuKy, ...data } = request;
    const verified =
      bank &&
      (await this.cryptographyService.verify(
        JSON.stringify(data),
        chuKy,
        bank.kPublic,
      ));
    if (!verified) {
      throw new BadRequestException({
        errorId: 'invalid_signature',
        message: 'Data verification failed',
      });
    }
    const dateDiff = new Date().getTime() - new Date(data.ngayTao).getTime();
    if (dateDiff > API_TIMEOUT) {
      throw new RequestTimeoutException({
        errorId: 'timeout',
        message: `Request sent from ${data.ngayTao} is outdated`,
      });
    }
  }

  private async createResponse<T extends object>(data: T) {
    const payload = { ...data, ngayTao: new Date().toISOString() };
    const signature = await this.cryptographyService
      .sign(JSON.stringify(payload))
      .catch((e) => {
        throw new InternalServerErrorException({
          errorId: 'internal_server_error',
          message: 'Cannot sign response',
        });
      });
    return { ...payload, chuKy: signature };
  }

  async getAccount(dto: GetAccountApiDto) {
    const bank = await this.banksService.findOne({ name: dto.tenNH });
    await this.verifyRequest(dto, bank);
    const paymentAccount = await this.paymenAccountsService.findOneInfo(
      dto.soTK,
    );
    if (!paymentAccount) {
      throw new BadRequestException({
        errorId: 'payment_account_not_found',
        message: 'Account not found',
      });
    }
    return this.createResponse(paymentAccount);
  }

  async transfer(dto: TransferApiDto) {
    const bank = await this.banksService.findOne({ name: dto.tenNH });
    await this.verifyRequest(dto, bank);
    const transaction = await this.prismaService.$transaction(async (tx) => {
      const transaction = await tx.chuyenKhoanNganHangNgoai.create({
        data: {
          tkNgoai: dto.nguoiChuyen,
          tkTrong: dto.nguoiNhan,
          noiDungCK: dto.noiDungCK,
          soTien: dto.soTien,
          loaiCK: dto.loaiCK,
          phiCK: dto.loaiCK === FeeType.Receiver ? FEE : 0,
          maNganHang: bank.maNH,
        },
        select: {
          maCKN: true,
          soTien: true,
          phiCK: true,
          thoiGian: true,
        },
      });
      let amount = dto.soTien;
      if (dto.loaiCK === FeeType.Receiver) {
        amount -= FEE;
      }
      await this.paymenAccountsService.increaseBalance({
        soTK: dto.nguoiNhan,
        amount,
      });
      return transaction;
    });
    return this.createResponse(transaction);
  }
}
