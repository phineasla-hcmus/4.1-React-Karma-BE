import { Injectable } from '@nestjs/common';
import { PaymentAccountsService } from 'src/paymentAccounts/paymentAccounts.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InterbankService {
  constructor(private paymentAccountService: PaymentAccountsService) {}

  async getPaymentAccountInfo(account_no: string) {
    return await this.paymentAccountService.getInfoByAccountNo(account_no);
  }
}
