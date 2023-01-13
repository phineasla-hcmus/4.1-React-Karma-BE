import { readFile } from 'fs/promises';
import { join } from 'path';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compile } from 'handlebars';
import type { SentMessageInfo, Transporter } from 'nodemailer';

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
  async sendPlainEmail(to: string, subject: string, text: string) {
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

  async sendEmail(
    to: string,
    subject: string,
    filename: string,
    context: object,
  ) {
    const template = compile(await readFile(join('template', filename)));
    const info = await this.transporter.sendMail({
      from: this.configService.get('EMAIL'),
      to,
      subject,
      html: template(context),
    });
    return info;
  }
}
