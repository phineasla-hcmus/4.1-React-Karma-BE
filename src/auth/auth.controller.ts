import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { JwtUser, Public } from '../common/decorators';
import { AtGuard, RtGuard } from '../common/guards';
import { JwtPayloadDto } from '../jwt/jwt.dto';

import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDTO) {
    return await this.authService.login(loginDto);
  }

  @Public()
  @Post('/admin/login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() loginDto: LoginDTO) {
    return await this.authService.login(loginDto);
  }

  @Public()
  @Post('/bankers/login')
  @HttpCode(HttpStatus.OK)
  async BankerLogin(@Body() loginDto: LoginDTO) {
    return await this.authService.login(loginDto);
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
