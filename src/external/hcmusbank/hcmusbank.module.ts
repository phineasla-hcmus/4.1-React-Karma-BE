import { readFile } from 'fs/promises';
import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { async } from 'rxjs';

import { AxiosModule } from '../../axios/axios.module';

import { HcmusbankService } from './hcmusbank.service';

@Module({
  providers: [
    {
      provide: 'HCMUS_PRIVATE_KEY_TOKEN',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        try {
          return await readFile(join(__dirname, 'hcmusbank.private.pem'));
        } catch {
          return configService.getOrThrow('HCMUSBANK_PRIVATE_KEY');
        }
      },
    },
    HcmusbankService,
  ],
  imports: [ConfigModule, AxiosModule],
  exports: [HcmusbankService],
})
export class HcmusbankModule {}
