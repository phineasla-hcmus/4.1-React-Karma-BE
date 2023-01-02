import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Transporter } from 'nodemailer';
import type { SentMessageInfo } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  constructor(
    private configService: ConfigService,
    @Inject('NODEMAILER_TRANSPORTER')
    private transporter: Transporter<SentMessageInfo>,
  ) {}

  /**
   *
   * @param to
   * @param subject
   * @param text
   * @throws Error
   */
  async sendEmail(to: string, subject: string, text: string) {
    let info: SentMessageInfo;
    try {
      info = await this.transporter.sendMail({
        from: this.configService.get('EMAIL'),
        to,
        subject,
        text,
      });
    } catch (error) {
      throw error;
    }
    return info;
  }
}
