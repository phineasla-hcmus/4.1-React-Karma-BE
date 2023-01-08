import { Injectable } from '@nestjs/common';

import { PaginationDto } from '../../pagination';
import { PrismaService } from '../../prisma/prisma.service';

import { CreateReminderDto } from './dto/create-reminder.dto';
import { FindRemindersDto } from './dto/find-reminders.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(private prismaService: PrismaService) {}

  create(createReminderDto: CreateReminderDto) {
    return 'This action adds a new reminder';
  }

  async findAllWithPagination(
    pagination: PaginationDto,
    dto: FindRemindersDto,
  ) {
    // const total = await this.prismaService.nhacNo.count({
    //   where: {},
    // });
  }

  findOne(id: number) {
    return `This action returns a #${id} reminder`;
  }

  update(id: number, updateReminderDto: UpdateReminderDto) {
    return `This action updates a #${id} reminder`;
  }

  remove(id: number) {
    return `This action removes a #${id} reminder`;
  }
}
