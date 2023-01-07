import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PaymentAccountsService } from '../paymentAccounts/paymentAccounts.service';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionOtpService } from '../transactions/transactionOtp.service';
import { TransactionsService } from '../transactions/transactions.service';

import { FindOneBankDto } from './dto/find-one-bank.dto';
import { FindOneExternalDto } from './dto/find-one-external.dto';
import { TransferDto } from './dto/transfer.dto';
import { HcmusbankService } from './hcmusbank/hcmusbank.service';

@Injectable()
export class ExternalService {
  constructor(
    private prismaService: PrismaService,
    private paymentAccountService: PaymentAccountsService,
    private otpService: TransactionOtpService,
    private transactionService: TransactionsService,
    private hcmusbankService: HcmusbankService,
  ) {}

  async findOneBank({ id, name }: FindOneBankDto) {
    if (id == null || name == null) {
      return null;
    }
    return this.prismaService.nganHangLienKet.findUnique({
      where: { maNH: id, tenNH: name },
    });
  }

  async findOneExternal(findOneExternalDto: FindOneExternalDto) {
    switch (findOneExternalDto.nganHang) {
      case 'HCMUSBank': {
        return this.hcmusbankService.findOneAccount(findOneExternalDto);
      }
    }
    return null;
  }

  async transfer(transferDto: TransferDto) {
    const otp = await this.otpService.findOne(transferDto.soTK);
    if (
      !this.otpService.verify(
        {
          otp: transferDto.otp,
          nguoiNhan: transferDto.nguoiNhan,
          soTK: transferDto.soTK,
          soTien: transferDto.soTien,
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
      this.findOneBank({ name: transferDto.nganHang }).then((v) => {
        if (v != null) return v;
        throw new NotFoundException({
          errorId: 'bank_not_found',
          message: `Cannot find bank with name ${transferDto.nganHang}`,
        });
      }),
      this.paymentAccountService.findOne(transferDto.soTK).then((v) => {
        if (v != null) return v;
        throw new NotFoundException({
          errorId: 'payment_account_not_found',
          message: `Cannot find payment account with ${transferDto.soTK}`,
        });
      }),
    ]);
    switch (transferDto.nganHang) {
      case 'HCMUSBank': {
        await this.hcmusbankService.transfer({
          fromAccountNumber: transferDto.soTK,
          toAccountNumber: transferDto.nguoiNhan,
          amount: transferDto.soTien,
          message: transferDto.noiDung,
          payer: transferDto.loaiCK,
        });
        break;
      }
      default:
        throw new NotFoundException({
          errorId: 'bank_not_found',
          message: `Cannot find bank with name ${transferDto.nganHang}`,
        });
    }
    return this.prismaService.$transaction(async (tx) => {
      await this.otpService.delete(otp.soTK, tx);
      // Shouldn't throw P2018 because we already checked payment account and bank are valid
      const transaction = await this.transactionService.createExternal(
        {
          internal: transferDto.soTK,
          external: transferDto.nguoiNhan,
          bank: transferDto.nganHang,
          // Minus indicate a deposit transaction
          amount: -transferDto.soTien,
          message: transferDto.noiDung,
        },
        tx,
      );
      await this.paymentAccountService.decreaseBalance(
        {
          soTK: transferDto.soTK,
          amount: transferDto.soTien,
        },
        tx,
      );
      return transaction;
    });
  }
}
