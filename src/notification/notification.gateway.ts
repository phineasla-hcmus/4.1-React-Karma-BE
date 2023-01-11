import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { NotificationService } from './notification.service';
import { NotificationClientStoreService } from './notificationClientStore.service';

@WebSocketGateway(3005, { cors: true })
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly notificationService: NotificationService,
    private readonly clientStoreService: NotificationClientStoreService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    // const bearer = 'Bearer ';
    // const header = client.handshake.headers.authorization;
    // const token: string | false =
    //   header?.startsWith(bearer) &&
    //   header.substring(bearer.length, header.length);
    // const user = token && (await this.notificationService.authenticate(token));
    // this.clientStoreService.add(user.maTK, client);
    console.log(client.data);
  }

  handleDisconnect(client: Socket) {
    throw new Error('Method not implemented.');
  }
}
