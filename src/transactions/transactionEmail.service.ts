import { Injectable, Logger } from '@nestjs/common';

import { ClientsService } from '../clients/clients.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class TransactionEmailService {
  private readonly logger: Logger = new Logger(TransactionEmailService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly clientsService: ClientsService,
  ) {}

  private censor(source: string, from: number, to: number) {
    return (
      source.substring(0, from) + '*'.repeat(to - from) + source.substring(to)
    );
  }

  async sendEmail(soTK: string, nguoiNhan: string, otp: number) {
    const user = await this.clientsService.findOneByPaymentAccount(soTK, {
      include: { khachHang: true },
    });
    return this.emailService.sendEmail(
      user.khachHang.email,
      'Verify your transaction',
      'confirm-transaction/index.html',
      {
        name: user.khachHang.hoTen,
        destination: this.censor(nguoiNhan, 0, nguoiNhan.length - 4),
        code: otp,
      },
    );
  }
}
