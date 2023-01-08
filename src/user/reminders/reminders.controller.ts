import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { Pagination, PaginationDto } from '../../pagination';

import { CreateReminderDto } from './dto/create-reminder.dto';
import { FindRemindersDto } from './dto/find-reminders.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { RemindersService } from './reminders.service';

@Controller('user/reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  create(@Body() createReminderDto: CreateReminderDto) {
    return this.remindersService.create(createReminderDto);
  }

  @Get()
  findAll(
    @Pagination() pagination: PaginationDto,
    @Query() dto: FindRemindersDto,
  ) {
    console.log(pagination);
    return this.remindersService.findAllWithPagination(pagination, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.remindersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReminderDto: UpdateReminderDto,
  ) {
    return this.remindersService.update(+id, updateReminderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.remindersService.remove(+id);
  }
}
