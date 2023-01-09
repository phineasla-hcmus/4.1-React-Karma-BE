import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BanksService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    try {
      const data = await this.prismaService.nganHangLienKet.findMany();
      return data.map(({ ...props }) => ({
        ...props,
        id: props.maNH,
      }));
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException({
          errorId: e.name,
          message: e.message,
          stack: e.stack,
        });
      }
    }
  }
}
