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
    const key = this.configService.getOrThrow('SECRET_KEY');
    const result = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${key}&response=${body.recaptchaValue}`,
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
