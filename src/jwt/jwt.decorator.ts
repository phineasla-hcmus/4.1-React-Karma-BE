import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const JwtUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (req && req.user) {
      return req.user;
    }
    throw new UnauthorizedException({
      errorId: 'invalid_jwt',
      message: 'Invalid or missing JWT token',
    });
  },
);
