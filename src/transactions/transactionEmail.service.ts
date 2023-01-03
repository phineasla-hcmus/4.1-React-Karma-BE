import { Injectable, Logger } from '@nestjs/common';

import { EmailService } from '../email/email.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TransactionEmailService {
  private readonly logger: Logger = new Logger(TransactionEmailService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  async sendEmail(soTK: string, otp: number) {
    const user = await this.usersService.findOneByPaymentAccount(soTK, {
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
