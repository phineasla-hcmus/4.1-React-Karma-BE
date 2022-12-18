import { Module } from '@nestjs/common';
import { InterbankController } from './interbank.controller';
import { InterbankService } from './interbank.service';

@Module({
  controllers: [InterbankController],
  providers: [InterbankService]
})
export class InterbankModule {}
