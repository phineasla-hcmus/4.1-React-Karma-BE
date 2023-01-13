import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  chuyenKhoanNganHangNgoai,
  chuyenKhoanNoiBo,
  nhacNo,
  Prisma,
  TrangThaiNhacNo,
} from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import {
  EVENT_REMINDER_CANCELLED,
  EVENT_REMINDER_CONFIRMED,
  EVENT_REMINDER_CREATED,
} from '../../constants';
import { NotificationGateway } from '../../notification/notification.gateway';
import { formatResponse, PaginationDto } from '../../pagination';
import { PaymentAccountsService } from '../../paymentAccounts/paymentAccounts.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../user.service';

import { CancelReminderDto } from './dto/cancel-reminder.dto';
import { ConfirmReminderDto } from './dto/confirm-reminder.dto';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { FindRemindersDto, ReminderType } from './dto/find-reminders.dto';

@Injectable()
export class RemindersService {
  constructor(
    private prismaService: PrismaService,
    private notification: NotificationGateway,
    private paymentAccountsService: PaymentAccountsService,
    private userService: UserService,
  ) {}

  private async findOneInfoByPayId(soTK: string) {
    return this.prismaService.khachHang.findFirst({
      where: {
        taiKhoan: { taiKhoanThanhToan: { soTK } },
      },
      select: { hoTen: true, maTK: true },
    });
  }

  async create(maTK: number, createReminderDto: CreateReminderDto) {
    const reminder = await this.prismaService.nhacNo
      .create({
        data: {
          soTien: createReminderDto.soTien,
          noiDungNN: createReminderDto.noiDung,
          ngayTao: new Date(),
          taiKhoanNguoiGui: {
            connect: { maTK: maTK, soTK: createReminderDto.soTK },
          },
          taiKhoanNguoiNhan: {
            connect: { soTK: createReminderDto.soTKNguoiNhan },
          },
        },
      })
      .catch((e) => {
        if (e instanceof PrismaClientKnownRequestError && e.code === 'P2018') {
          throw new BadRequestException({
            errorId: 'bad_reminder',
            message: 'Invalid receiver/sender IDs',
          });
        }
        throw new InternalServerErrorException({
          errorId: 'database_error',
          message: e.message,
          stack: e.stack,
        });
      });
    this.notifyCreated(reminder);
    return reminder;
  }

  private async notifyCreated(reminder: nhacNo) {
    const receiver = await this.findOneInfoByPayId(reminder.soTKNguoiNhan);
    const payload = {
      tenNguoiGui: receiver.hoTen,
      soTKNguoiGui: reminder.soTKNguoiGui,
      soTien: reminder.soTien,
      noiDungNN: reminder.noiDungNN,
    };
    return this.notification.emit(
      EVENT_REMINDER_CREATED,
      receiver.maTK,
      payload,
    );
  }

  async findAllWithPagination(
    maTK: number,
    pagination: PaginationDto,
    dto: FindRemindersDto,
  ) {
    let query: Prisma.nhacNoWhereInput;
    if (dto.type === ReminderType.ForMe) {
      query = { taiKhoanNguoiNhan: { maTK: maTK } };
    } else if (dto.type === ReminderType.ForOthers) {
      query = { taiKhoanNguoiGui: { maTK: maTK } };
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

  async findOne(maNN: number) {
    return this.prismaService.nhacNo.findUnique({ where: { maNN: maNN } });
  }

  async confirm(maTK: number, maNN: number, dto: ConfirmReminderDto) {
    let reminder = await this.findOne(maNN);
    const transaction = await this.userService.transfer({
      otp: dto.otp,
      soTK: reminder.soTKNguoiNhan,
      noiDung: dto.noiDung,
      loaiCK: dto.loaiCK,
      soTien: reminder.soTien,
      nguoiNhan: reminder.soTKNguoiGui,
    });
    reminder = await this.prismaService.nhacNo.update({
      where: { maNN: maNN },
      data: {
        ngayThanhToan: new Date(),
        trangThai: TrangThaiNhacNo.done,
        giaoDichLienKet: { connect: { maCK: transaction.maCK } },
      },
    });
    this.notifyConfirm(reminder, transaction);
    return reminder;
  }

  private async notifyConfirm(reminder: nhacNo, transaction: chuyenKhoanNoiBo) {
    const [reminderSender, reminderReceiver] = await Promise.all(
      [reminder.soTKNguoiGui, reminder.soTKNguoiNhan].map((payId) =>
        this.findOneInfoByPayId(payId),
      ),
    );
    const reminderSenderPayload = {
      tenNguoiChuyen: reminderReceiver.hoTen,
      chuyenKhoanNoiBo: transaction,
    };
    const reminderReceiverPayload = {
      tenNguoiNhan: reminderSender.hoTen,
      chuyenKhoanNoiBo: transaction,
    };
    return (
      this.notification.emit(
        EVENT_REMINDER_CONFIRMED,
        reminderSender.maTK,
        reminderSenderPayload,
      ) &&
      this.notification.emit(
        EVENT_REMINDER_CONFIRMED,
        reminderReceiver.maTK,
        reminderReceiverPayload,
      )
    );
  }

  async cancel(maNN: number, dto: CancelReminderDto) {
    const reminder = await this.prismaService.nhacNo.update({
      where: { maNN: maNN },
      data: { noiDungXoa: dto.noiDungXoa, trangThai: TrangThaiNhacNo.cancel },
    });
    this.notifyCancelled(reminder);
    return reminder;
  }

  private async notifyCancelled(reminder: nhacNo) {
    const [reminderSender, reminderReceiver] = await Promise.all(
      [reminder.soTKNguoiGui, reminder.soTKNguoiNhan].map((payId) =>
        this.findOneInfoByPayId(payId),
      ),
    );
    const payload = {
      tenNguoiGui: reminderSender.hoTen,
      tenNguoiNhan: reminderReceiver.hoTen,
      soTien: reminder.soTien,
      noiDungXoa: reminder.noiDungXoa,
    };
    return this.notification.emitMany(
      EVENT_REMINDER_CANCELLED,
      [reminderSender.maTK, , reminderReceiver.maTK],
      payload,
    );
  }
}
