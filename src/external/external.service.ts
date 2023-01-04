import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { TransactionOtpService } from '../transactions/transactionOtp.service';
import { TransactionsService } from '../transactions/transactions.service';

import { FindOneAccountDto } from './dto/find-one-account.dto';
import { TransferDto } from './dto/transfer.dto';
import { HcmusbankService } from './hcmusbank/hcmusbank.service';

@Injectable()
export class ExternalService {
  constructor(
    private otpService: TransactionOtpService,
    private transactionService: TransactionsService,
    private hcmusbankService: HcmusbankService,
  ) {}

  async findOneAccount(findOneAccountDto: FindOneAccountDto) {
    switch (findOneAccountDto.nganHang) {
      case 'HCMUSBank': {
        return this.hcmusbankService.findOneAccount(findOneAccountDto);
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
    await this.otpService.delete(otp.soTK);
    let res: any;
    switch (transferDto.nganHang) {
      case 'HCMUSBank': {
        res = await this.hcmusbankService.transfer({
          fromAccountNumber: transferDto.soTK,
          toAccountNumber: transferDto.nguoiNhan,
          amount: transferDto.soTien,
          message: transferDto.noiDung,
          payer: transferDto.hinhThuc,
        });
        break;
      }
      default:
        throw new NotFoundException({
          errorId: 'bank_not_found',
          message: `Cannot find bank with name ${transferDto.nganHang}`,
        });
    }
    if (res == null) {
      throw new InternalServerErrorException({
        errorId: 'bad_transaction',
        message: 'Something went wrong when connecting to HCMUSBank',
      });
    }
    return this.transactionService.createExternal({
      tkTrong: transferDto.soTK,
      tkNgoai: transferDto.nguoiNhan,
      nganHang: transferDto.nganHang,
      // Minus indicate a deposit transaction
      soTien: -transferDto.soTien,
      noiDungCK: transferDto.noiDung,
    });
  }
}
