import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { JwtPayloadDto } from '../../jwt/jwt.dto';

export const JwtUser = createParamDecorator(
  (
    data: string | undefined,
    context: ExecutionContext,
  ): string | JwtPayloadDto | number => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
