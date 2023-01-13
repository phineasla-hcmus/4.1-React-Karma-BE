import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtUser, Public } from '../common/decorators';
import { AtGuard, RtGuard } from '../common/guards';
import { RecaptchaGuard } from '../common/guards/recaptcha.guard';
import { JwtPayloadDto } from '../jwt/jwt.dto';

import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(RecaptchaGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDTO) {
    const data = await this.authService.login(loginDto);
    return { data };
  }

  @Public()
  @UseGuards(RecaptchaGuard)
  @Post('/admin/login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() loginDto: LoginDTO) {
    const data = await this.authService.adminLogin(loginDto);
    return { data };
  }

  @Public()
  @UseGuards(RecaptchaGuard)
  @Post('/bankers/login')
  @HttpCode(HttpStatus.OK)
  async BankerLogin(@Body() loginDto: LoginDTO) {
    const data = await this.authService.bankerLogin(loginDto);
    return { data };
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@JwtUser('maTK') maTK: number) {
    return this.authService.logout(maTK);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@JwtUser() account: JwtPayloadDto) {
    return this.authService.refreshTokens(account.maTK, account.refreshToken);
  }
}
