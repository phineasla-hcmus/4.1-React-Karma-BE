import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';

import { EmailService } from './email.service';

@Module({
  providers: [
    {
      provide: 'NODEMAILER_TRANSPORTER',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createTransport({
          service: configService.get('EMAIL_SERVICE'),
          auth: {
            user: configService.get('EMAIL'),
            pass: configService.get('EMAIL_PASSWORD'),
          },
        }),
    },
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
