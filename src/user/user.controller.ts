import { Controller, Post, Body } from '@nestjs/common';
import { TransferDto } from './dto/transfer.dto';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async transfer(@Body() transferDto: TransferDto) {
    try {
      return this.userService.transfer(transferDto);
    } catch (e) {
      throw e;
    }
  }
}
