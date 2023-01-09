import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { FEE } from '../constants';
import { PaymentAccountsService } from '../paymentAccounts/paymentAccounts.service';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionOtpService } from '../transactions/transactionOtp.service';
import { TransactionsService } from '../transactions/transactions.service';
import { FeeType } from '../types';

import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private paymentAccountService: PaymentAccountsService,
    private otpService: TransactionOtpService,
    private transactionService: TransactionsService,
  ) {}

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
    await Promise.all(
      [transferDto.soTK, transferDto.nguoiNhan].map((id) =>
        this.paymentAccountService.findOne(id).then((v) => {
          if (v != null) return v;
          throw new NotFoundException({
            errorId: 'payment_account_not_found',
            message: `Cannot find payment account with ${id}`,
          });
        }),
      ),
    );
    return this.prismaService.$transaction(async (tx) => {
      await this.otpService.delete(otp.soTK, tx);
      // Shouldn't throw P2018 because we already checked payment accounts are valid
      await this.transactionService.create(
        {
          sender: transferDto.soTK,
          receiver: transferDto.nguoiNhan,
          amount: transferDto.soTien,
          message: transferDto.noiDung,
          fee: FEE,
          feeType: transferDto.loaiCK,
        },
        tx,
      );
      const senderFee = transferDto.loaiCK === FeeType.Sender ? FEE : 0;
      await this.paymentAccountService.decreaseBalance(
        {
          soTK: transferDto.soTK,
          amount: transferDto.soTien + senderFee,
        },
        tx,
      );
      const receiverFee = transferDto.loaiCK === FeeType.Receiver ? FEE : 0;
      await this.paymentAccountService.increaseBalance(
        {
          soTK: transferDto.nguoiNhan,
          amount: transferDto.soTien - receiverFee,
        },
        tx,
      );
    });
  }
}
