import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { formatResponse, PaginationDto } from '../../pagination';
import { PrismaService } from '../../prisma/prisma.service';

import { CreateReminderDto } from './dto/create-reminder.dto';
import { FindRemindersDto, ReminderType } from './dto/find-reminders.dto';

@Injectable()
export class RemindersService {
  constructor(private prismaService: PrismaService) {}

  async create(maTK: number, createReminderDto: CreateReminderDto) {
    // TODO realtime notification
    return this.prismaService.nhacNo
      .create({
        data: {
          soTien: createReminderDto.soTien,
          noiDungNN: createReminderDto.noiDung,
          ngayTao: new Date(),
          taiKhoanNguoiGui: { connect: { maTK: maTK } },
          taiKhoanThanhToan: {
            connect: { maTK: maTK, soTK: createReminderDto.soTK },
          },
          taiKhoanNguoiNhan: { connect: { maTK: createReminderDto.nguoiNhan } },
        },
      })
      .catch((e) => {
        if (e instanceof PrismaClientKnownRequestError && e.code === 'P2018') {
          throw new BadRequestException({
            errorId: 'bad_reminder',
            message: 'Invalid "maTK", "soTK" or "nguoiNhan"',
          });
        }
        throw new InternalServerErrorException({
          errorId: 'database_error',
          message: e.message,
          stack: e.stack,
        });
      });
  }

  async findAllWithPagination(
    maTK: number,
    pagination: PaginationDto,
    dto: FindRemindersDto,
  ) {
    let query: Prisma.nhacNoWhereInput;
    if (dto.type === ReminderType.ForMe) {
      query = { nguoiNhan: maTK };
    } else if (dto.type === ReminderType.ForOthers) {
      query = { nguoiGui: maTK };
    } else {
      throw new BadRequestException({
        errorId: 'invalid_reminder_type',
        message: `Cannot find reminders with type ${dto.type}`,
      });
    }
    const [total, reminders] = await Promise.all([
      this.prismaService.nhacNo.count({
        where: query,
      }),
      this.prismaService.nhacNo.findMany({
        where: query,
        skip: (pagination.page - 1) * pagination.size,
        take: pagination.size,
      }),
    ]).catch((e) => {
      throw new InternalServerErrorException({
        errorId: 'database_error',
        message: e.message,
        stack: e.stack,
      });
    });
    const lastPage = Math.ceil(total / pagination.size);
    return formatResponse(
      pagination,
      total,
      lastPage,
      reminders,
      'user/reminders',
    );
  }

  remove(id: number) {
    // TODO realtime notification
    return `This action removes a #${id} reminder`;
  }
}
