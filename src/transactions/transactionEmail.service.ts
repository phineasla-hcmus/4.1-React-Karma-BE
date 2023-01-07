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

  async sendEmail(soTK: string, otp: number) {
    const user = await this.clientsService.findOneByPaymentAccount(soTK, {
      include: { khachHang: true },
    });
    const content = `Dear ${user.khachHang.hoTen},

    Please enter this confirmation code to confirm your transaction: 
    ${otp}

    Thank you!
    `;
    return await this.emailService.sendEmail(
      user.khachHang.email,
      'Verify your transaction',
      content,
    );
  }
}
