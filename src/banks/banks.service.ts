import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { FindOneBankDto } from './dto/find-one-bank.dto';

@Injectable()
export class BanksService {
  constructor(private prismaService: PrismaService) {}

  async findOne({ id, name }: FindOneBankDto) {
    if (id == null && name == null) {
      return null;
    }
    return this.prismaService.nganHangLienKet.findUnique({
      where: { maNH: id, tenNH: name },
    });
  }

  async findAll() {
    return this.prismaService.nganHangLienKet.findMany({
      select: { maNH: true, tenNH: true },
    });
  }
}
