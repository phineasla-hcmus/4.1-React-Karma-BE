import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags, OmitType } from '@nestjs/swagger';
import { TrangThaiNhacNo } from '@prisma/client';

import { JwtUser } from '../../jwt/jwt.decorator';
import { JwtUserDto } from '../../jwt/jwt.dto';
import { Pagination, PaginationDto } from '../../pagination';
import {
  ApiOkPaginatedResponse,
  ApiOkWrappedResponse,
} from '../../swagger/swagger.decorator';

import { CancelReminderDto } from './dto/cancel-reminder.dto';
import { ConfirmReminderDto } from './dto/confirm-reminder.dto';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { FindRemindersDto } from './dto/find-reminders.dto';
import { Reminder } from './entities/reminder.entity';
import { RemindersService } from './reminders.service';

@ApiTags('user/reminders')
@Controller('user/reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  @ApiOperation({ summary: 'Create reminder' })
  @ApiOkWrappedResponse({ type: OmitType(Reminder, ['noiDungXoa'] as const) })
  async create(
    @JwtUser() user: JwtUserDto,
    @Body() createReminderDto: CreateReminderDto,
  ) {
    const { maTK } = user;
    const data = await this.remindersService.create(maTK, createReminderDto);
    return { data };
  }

  @Get()
  @ApiOperation({ summary: 'Get list of reminders' })
  @ApiOkPaginatedResponse({ type: Reminder })
  findAll(
    @JwtUser() user: JwtUserDto,
    @Pagination() pagination: PaginationDto,
    @Query() dto: FindRemindersDto,
  ) {
    const { maTK } = user;
    return this.remindersService.findAllWithPagination(maTK, pagination, dto);
  }

  /**
   * Local transfer + mark reminder as DONE
   */
  @Patch()
  @ApiOperation({ summary: 'Checkout a reminder' })
  @ApiQuery({ name: 'maNN', description: 'Reminder ID' })
  async confirm(
    @JwtUser() user: JwtUserDto,
    @Param('maNN', ParseIntPipe) maNN: number,
    @Body() dto: ConfirmReminderDto,
  ) {
    const { maTK } = user;
    const data = await this.remindersService.confirm(maTK, maNN, dto);
  }

  @Delete(':maNN')
  @ApiOperation({ summary: 'Cancel reminder' })
  @ApiOkWrappedResponse({ type: Reminder })
  @ApiQuery({ name: 'maNN', description: 'Reminder ID' })
  async cancel(
    @JwtUser() user: JwtUserDto,
    @Param('maNN', ParseIntPipe) maNN: number,
    dto: CancelReminderDto,
  ) {
    const reminder = await this.remindersService.findOne(maNN);
    if (!reminder) {
      throw new NotFoundException({
        errorId: 'reminder_not_found',
        message: `Cannot find reminder with ID ${maNN}`,
      });
    }
    if (reminder.trangThai === TrangThaiNhacNo.done) {
      return { data: reminder };
    }
    return this.remindersService.cancel(maNN, dto);
  }
}
