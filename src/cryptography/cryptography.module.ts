import { Global, Module } from '@nestjs/common';
import { CryptographyService } from './cryptography.service';

@Global()
@Module({
  providers: [CryptographyService],
  exports: [CryptographyService],
})
export class CryptographyModule {}
