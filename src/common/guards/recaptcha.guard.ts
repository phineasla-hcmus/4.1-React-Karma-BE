import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class RecaptchaGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { body } = context.switchToHttp().getRequest();
    const result = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${this.configService.getOrThrow(
        'RECAPTCHA_KEY',
      )}&response=${body.recaptchaValue}`,
      {},
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
      },
    );
    const data = result.data;
    if (!data.success) {
      throw new ForbiddenException({
        errorId: HttpStatus.FORBIDDEN,
        message: 'Recaptcha is invalid',
      });
    }

    return true;
  }
}
