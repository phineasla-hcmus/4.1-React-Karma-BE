import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(3005, { cors: true })
export class NotificationGateway {
  @WebSocketServer() server: Server;
  private readonly logger: Logger = new Logger(NotificationGateway.name);

  emit(event: string, userId: number, payload: object) {
    return this.server.to(String(userId)).emit(event, payload, (res) => {
      this.logger.verbose(`${event} - ${userId}`);
    });
  }

  emitMany(event: string, userIds: number[], payload: object) {
    return userIds.map((id) => this.emit(event, id, payload));
  }
}
