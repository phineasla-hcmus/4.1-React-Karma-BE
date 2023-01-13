import { Controller, Post, Body, Get, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtUser } from '../common/decorators';
import { JwtUserDto } from '../jwt/jwt.dto';
import { ApiOkWrappedResponse } from '../swagger/swagger.decorator';

import { InfoResponseDto } from './dto/info.response.dto';
import { LocalTransferDto } from './dto/transfer.dto';
import { LocalTransferResponseDto } from './dto/transfer.response.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Post('transfer')
  @ApiOperation({
    summary: 'User local transfer (transfer in only Karma Bank)',
  })
  @ApiOkWrappedResponse({
    type: LocalTransferResponseDto,
  })
  async transfer(@Body() transferDto: LocalTransferDto) {
    try {
      const data = await this.userService.transfer(transferDto);
      return { data };
    } catch (e) {
      throw e;
    }
  }
}
