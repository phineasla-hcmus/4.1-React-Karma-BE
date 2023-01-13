import { INestApplicationContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { verify } from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';

import { JwtPayloadDto } from './jwt/jwt.dto';

export class SocketAdapter extends IoAdapter {
  config: ConfigService;

  constructor(app: INestApplicationContext) {
    super(app);
    this.config = app.get(ConfigService);
  }

  private authMiddleware(socket: Socket, next: (err?: Error) => void) {
    const bearer = 'Bearer ';
    const bearerToken: string = socket.handshake.auth.token;
    const token: string | false =
      bearerToken?.startsWith(bearer) &&
      bearerToken.substring(bearer.length, bearerToken.length);
    const user = verify(
      token,
      this.config.getOrThrow('AT_SECRET'),
    ) as JwtPayloadDto;

    if (!user) {
      next(
        new UnauthorizedException({
          errorId: 'unauthorized',
          message: 'Cannot validate token',
        }),
      );
    }
    socket.join(String(user.maTK));
    socket.data = user;
    next();
  }

  createIOServer(port: number, options?: any) {
    const server: Server = super.createIOServer(port, options);
    server.use(this.authMiddleware);
    return server;
  }
}
