import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { VaiTro } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayLoad = {
  sub: string;
  tenDangNhap: string;
  hoTen: string;
  vaiTro: VaiTro;
};
@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'at-secret',
    });
  }
  validate(payload: JwtPayLoad) {
    return payload;
  }
}
