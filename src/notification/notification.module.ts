import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { NotificationGateway } from './notification.gateway';

@Module({
  providers: [NotificationGateway],
  imports: [ConfigModule],
  exports: [NotificationGateway],
})
export class NotificationModule {}
