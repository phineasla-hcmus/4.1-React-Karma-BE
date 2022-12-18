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
      return await this.prismaService.chuyenKhoan.findMany({
        where: {
          chuyenNoiBo: false,
        },
        select: {
          maCK: true,
          nguoiChuyen: true,
          nguoiNhan: true,
          soTien: true,
          ngayCK: true,
          nganHangLienKet: {
            select: {
              maNH: true,
              tenNH: true,
            },
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
  }

  async findAllWithPagination(pagination: PaginationDto) {
    let total;
    try {
      total = await this.prismaService.chuyenKhoan.count({
        where: {
          chuyenNoiBo: false,
        },
      });
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
      interbankList = await this.prismaService.chuyenKhoan.findMany({
        skip: (pagination.page - 1) * pagination.size,
        take: pagination.size,
        select: {
          maCK: true,
          nguoiChuyen: true,
          nguoiNhan: true,
          soTien: true,
          ngayCK: true,
          nganHangLienKet: {
            select: {
              maNH: true,
              tenNH: true,
            },
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
    let banker;
    try {
      banker = await this.prismaService.chuyenKhoan.findUnique({
        where: {
          maCK: id,
        },
        select: {
          maCK: true,
          nguoiChuyen: true,
          nguoiNhan: true,
          soTien: true,
          ngayCK: true,
          nganHangLienKet: {
            select: {
              maNH: true,
              tenNH: true,
            },
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

    if (!banker) {
      throw new NotFoundException({
        errorId: 'id_not_found',
        message: 'Id not found',
      });
    }
    return banker;
  }
}
