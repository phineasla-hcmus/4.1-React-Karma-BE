import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
import { NotificationClientStoreService } from './notificationClientStore.service';

@Module({
  providers: [
    NotificationGateway,
    NotificationService,
    NotificationClientStoreService,
  ],
  imports: [ConfigModule],
})
export class NotificationModule {}
