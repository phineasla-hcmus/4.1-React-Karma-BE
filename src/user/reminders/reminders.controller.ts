import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';

import { JwtUser } from '../../jwt/jwt.decorator';
import { JwtUserDto } from '../../jwt/jwt.dto';
import { Pagination, PaginationDto } from '../../pagination';

import { CreateReminderDto } from './dto/create-reminder.dto';
import { FindRemindersDto } from './dto/find-reminders.dto';
import { RemindersService } from './reminders.service';

@Controller('user/reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  create(
    @JwtUser() user: JwtUserDto,
    @Body() createReminderDto: CreateReminderDto,
  ) {
    const { maTK } = user;
    return this.remindersService.create(maTK, createReminderDto);
  }

  @Get()
  findAll(
    @JwtUser() user: JwtUserDto,
    @Pagination() pagination: PaginationDto,
    @Query() dto: FindRemindersDto,
  ) {
    const { maTK } = user;
    return this.remindersService.findAllWithPagination(maTK, pagination, dto);
  }

  @Patch()
  confirm(@JwtUser() user: JwtUserDto) {
    const { maTK } = user;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.remindersService.remove(+id);
  }
}
