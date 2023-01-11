import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiOkWrappedResponse } from '../swagger/swagger.decorator';

import { LocalTransferDto } from './dto/transfer.dto';
import { TransferResponseDto } from './dto/transfer.response.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('transfer')
  @ApiOkWrappedResponse({ type: TransferResponseDto })
  async transfer(@Body() transferDto: LocalTransferDto) {
    try {
      const data = await this.userService.transfer(transferDto);
      return { data };
    } catch (e) {
      throw e;
    }
  }
}
