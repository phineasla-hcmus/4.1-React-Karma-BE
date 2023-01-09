import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PaymentAccountsService } from '../../paymentAccounts/paymentAccounts.service';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateContactDto } from './dto/create-contact.dto';
import { FindOneContactDto } from './dto/find-one-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    private prismaService: PrismaService,
    private paymentAccountsService: PaymentAccountsService,
  ) {}

  async findOne({ maTK, nguoiDung }: FindOneContactDto) {
    return this.prismaService.danhSachDaLuu.findUnique({
      where: { maTK_nguoiDung: { maTK: maTK, nguoiDung: nguoiDung } },
    });
  }

  async findAllWithoutPagination(maTK: number) {
    return this.prismaService.danhSachDaLuu.findMany({ where: { maTK: maTK } });
  }

  async create(maTK: number, { nguoiDung, tenGoiNho }: CreateContactDto) {
    const paymentAccount = await this.paymentAccountsService.findOneInfo(
      nguoiDung,
    );
    if (!paymentAccount) {
      throw new NotFoundException({
        errorId: 'not_found_payment_account',
        message: `Cannot find payment account with ID ${nguoiDung}`,
      });
    }
    return this.prismaService.danhSachDaLuu
      .create({
        data: {
          tenGoiNho: tenGoiNho || paymentAccount.hoTen,
          taiKhoanChuDS: { connect: { maTK: maTK } },
          taiKhoanNguoiDung: { connect: { soTK: nguoiDung } },
        },
      })
      .catch((e) => {
        if (e instanceof PrismaClientKnownRequestError && e.code === 'P2018') {
          throw new BadRequestException({
            errorId: 'bad_body',
            message: 'Invalid request for creating contact',
          });
        }
        throw new InternalServerErrorException({
          errorId: 'database_error',
          message: 'Cannot create new contact',
        });
      });
  }

  async update(
    maTK: number,
    nguoiDung: string,
    { tenGoiNho }: UpdateContactDto,
  ) {
    return this.prismaService.danhSachDaLuu.update({
      where: {
        maTK_nguoiDung: { maTK: maTK, nguoiDung: nguoiDung },
      },
      data: {
        tenGoiNho: tenGoiNho,
      },
    });
  }

  async remove(maTK: number, nguoiDung: string) {
    return this.prismaService.danhSachDaLuu.delete({
      where: {
        maTK_nguoiDung: { maTK: maTK, nguoiDung: nguoiDung },
      },
    });
  }
}
