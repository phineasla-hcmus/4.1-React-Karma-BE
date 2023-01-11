import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';

import { JwtPayloadDto } from '../jwt/jwt.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly configService: ConfigService) {}

  async authenticate(token: string) {
    return verify(
      token,
      this.configService.getOrThrow('AT_SECRET'),
    ) as JwtPayloadDto;
  }
}
