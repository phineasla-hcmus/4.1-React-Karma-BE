import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BanksService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.nganHangLienKet.findMany({
      select: { maNH: true, tenNH: true },
    });
  }
}
