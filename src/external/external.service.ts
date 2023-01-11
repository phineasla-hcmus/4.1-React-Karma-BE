import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { BanksService } from '../banks/banks.service';
import { FEE } from '../constants';
import { PaymentAccountsService } from '../paymentAccounts/paymentAccounts.service';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionOtpService } from '../transactions/transactionOtp.service';
import { TransactionsService } from '../transactions/transactions.service';
import { FeeType } from '../types';

import { FindOneExternalDto } from './dto/find-one-external.dto';
import { TransferDto } from './dto/transfer.dto';
import { HcmusbankService } from './hcmusbank/hcmusbank.service';

@Injectable()
export class ExternalService {
  constructor(
    private prismaService: PrismaService,
    private banksService: BanksService,
    private paymentAccountService: PaymentAccountsService,
    private otpService: TransactionOtpService,
    private transactionService: TransactionsService,
    private hcmusbankService: HcmusbankService,
  ) {}

  async findAll() {
    return this.prismaService.nganHangLienKet.findMany();
  }

  async findOneExternal(findOneExternalDto: FindOneExternalDto) {
    switch (findOneExternalDto.nganHang) {
      case 'HCMUSBank': {
        return this.hcmusbankService.findOneAccount(findOneExternalDto);
      }
    }
    return null;
  }

  async transfer(dto: TransferDto) {
    const otp = await this.otpService.findOne(dto.soTK);
    if (
      !this.otpService.verify(
        {
          otp: dto.otp,
          nguoiNhan: dto.nguoiNhan,
          soTK: dto.soTK,
          soTien: dto.soTien,
        },
        otp,
      )
    ) {
      throw new UnauthorizedException({
        errorId: 'invalid_otp',
        message: 'Invalid OTP',
      });
    }
    await Promise.all([
      this.banksService.findOne({ name: dto.nganHang }).then((v) => {
        if (v != null) return v;
        throw new NotFoundException({
          errorId: 'bank_not_found',
          message: `Cannot find bank with name ${dto.nganHang}`,
        });
      }),
      this.paymentAccountService.findOne(dto.soTK).then((v) => {
        if (v != null) return v;
        throw new NotFoundException({
          errorId: 'payment_account_not_found',
          message: `Cannot find payment account with ${dto.soTK}`,
        });
      }),
    ]);
    switch (dto.nganHang) {
      case 'HCMUSBank': {
        await this.hcmusbankService.transfer({
          fromAccountNumber: dto.soTK,
          toAccountNumber: dto.nguoiNhan,
          amount: dto.soTien,
          message: dto.noiDung,
          payer: dto.loaiCK,
        });
        break;
      }
      default:
        throw new NotFoundException({
          errorId: 'bank_not_found',
          message: `Cannot find bank with name ${dto.nganHang}`,
        });
    }
    return this.prismaService.$transaction(async (tx) => {
      await this.otpService.delete(otp.soTK, tx);
      // Shouldn't throw P2018 because we already checked payment account and bank are valid
      const transaction = await this.transactionService.createExternal(
        {
          internal: dto.soTK,
          external: dto.nguoiNhan,
          bank: dto.nganHang,
          // Minus indicate a deposit transaction
          amount: -dto.soTien,
          type: dto.loaiCK,
          fee: dto.loaiCK === FeeType.Sender ? FEE : 0,
          message: dto.noiDung,
        },
        tx,
      );
      let amount = dto.soTien;
      if (dto.loaiCK === FeeType.Sender) {
        amount += FEE;
      }
      await this.paymentAccountService.decreaseBalance(
        {
          soTK: dto.soTK,
          amount,
        },
        tx,
      );
      return transaction;
    });
  }
}
