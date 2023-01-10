import { readFile } from 'fs/promises';
import { join } from 'path';

import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CryptographyService } from './cryptography.service';

@Global()
@Module({
  providers: [
    {
      provide: 'INTERBANK_PRIVATE_KEY_TOKEN',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        try {
          return await readFile(join(__dirname, 'response.private.key'));
        } catch {
          return configService.getOrThrow('INTERBANK_PRIVATE_KEY');
        }
      },
    },
    CryptographyService,
  ],
  exports: [CryptographyService],
})
export class CryptographyModule {}
