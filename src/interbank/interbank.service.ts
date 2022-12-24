import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { formatResponse, PaginationDto } from 'src/pagination';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InterbankService {
  constructor(private prismaService: PrismaService) {}

  async findAllWithoutPagination() {
    try {
      return await this.prismaService.chuyenKhoanNganHangNgoai.findMany({
        include: {
          nganHangLK: true,
        },
      });
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

  async findAllWithPagination(pagination: PaginationDto) {
    let total;
    try {
      total = await this.prismaService.chuyenKhoanNganHangNgoai.count();
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException({
          errorId: 'database_error',
          message: e.message,
          stack: e.stack,
        });
      }
      throw e;
    }
    let interbankList;
    try {
      interbankList =
        await this.prismaService.chuyenKhoanNganHangNgoai.findMany({
          skip: (pagination.page - 1) * pagination.size,
          take: pagination.size,
          include: {
            nganHangLK: true,
          },
        });
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException({
          errorId: e.name,
          message: e.message,
          stack: e.stack,
        });
      }
    }
    const lastPage = Math.ceil(total / pagination.size);

    return formatResponse(
      pagination,
      total,
      lastPage,
      interbankList,
      'interbank',
    );
  }

  //id: mã chuyển khoản
  async findOne(id: number) {
    try {
      return await this.prismaService.chuyenKhoanNganHangNgoai.findUnique({
        where: {
          maCKN: id,
        },
        include: {
          nganHangLK: true,
        },
      });
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

  async findStatistic() {
    let statistic = {
      soTienGui: 0,
      soTienNhan: 0,
    };
    let sent, received;
    try {
      sent = await this.prismaService.chuyenKhoanNganHangNgoai.aggregate({
        _sum: {
          soTien: true,
        },
        where: {
          soTien: { gt: 0 },
        },
      });
      received = await this.prismaService.chuyenKhoanNganHangNgoai.aggregate({
        _sum: {
          soTien: true,
        },
        where: {
          soTien: {
            lt: 0,
          },
        },
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException({
          errorId: e.name,
          message: e.message,
          stack: e.stack,
        });
      }
    }
    statistic.soTienGui = sent._sum.soTien;
    statistic.soTienNhan = -received._sum.soTien;
    return statistic;
  }
}
