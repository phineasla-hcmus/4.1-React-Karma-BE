import {
  Controller,
  Post,
  Body,
  Get,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtUser, Role } from '../common/decorators';
import { JwtUserDto } from '../jwt/jwt.dto';
import { ApiOkWrappedResponse } from '../swagger/swagger.decorator';

import { InfoResponseDto } from './dto/info.response.dto';
import { LocalTransferDto } from './dto/transfer.dto';
import { LocalTransferResponseDto } from './dto/transfer.response.dto';
import { UserService } from './user.service';
import { VaiTro } from '@prisma/client';
import { RoleGuard } from '../common/guards';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Role(VaiTro.User)
  @UseGuards(RoleGuard)
  @Get('info')
  @ApiOkWrappedResponse({ type: InfoResponseDto })
  async getInfo(@JwtUser() user: JwtUserDto) {
    const { maTK } = user;
    const data = await this.userService.getInfo(maTK);
    if (!data) {
      throw new NotFoundException({
        errorId: 'user_not_found',
        message: `Cannot get info for ${maTK}`,
      });
    }
    return { data };
  }

  @Role(VaiTro.User)
  @UseGuards(RoleGuard)
  @Post('transfer')
  @ApiOkWrappedResponse({ type: LocalTransferResponseDto })
  async transfer(@Body() transferDto: LocalTransferDto) {
    try {
      const data = await this.userService.transfer(transferDto);
      return { data };
    } catch (e) {
      throw e;
    }
  }
}
