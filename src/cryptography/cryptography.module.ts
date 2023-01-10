import { Global, Module } from '@nestjs/common';

import { CryptographyService } from './cryptography.service';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'fs/promises';
import { join } from 'path';

@Global()
@Module({
  providers: [
    {
      provide: 'KARMA_PRIVATE_KEY_TOKEN',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        try {
          return await readFile(
            join(__dirname, 'response.private.pem'),
            'utf-8',
          );
        } catch {
          return configService.getOrThrow('HCMUSBANK_PRIVATE_KEY');
        }
      },
    },
    ,
    CryptographyService,
  ],
  exports: ['KARMA_PRIVATE_KEY_TOKEN', CryptographyService],
})
export class CryptographyModule {}
