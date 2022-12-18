import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { formatResponse, PaginationDto } from 'src/pagination';

import { PrismaService } from '../prisma/prisma.service';

import { CreateBankerDto } from './dto/create-banker.dto';
import { UpdateBankerDto } from './dto/update-banker.dto';

@Injectable()
export class BankersService {
  constructor(private prismaService: PrismaService) {}

  async create(createBankerDto: CreateBankerDto) {
    try {
      return await this.prismaService.taiKhoan.create({
        data: {
          tenDangNhap: createBankerDto.tenDangNhap,
          matKhau: createBankerDto.matKhau,
          vaiTro: 'Banker',
          nhanVien: {
            create: {
              hoTen: createBankerDto.hoTen,
              sdt: createBankerDto.sdt,
            },
          },
        },
        include: {
          nhanVien: true,
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

  async findAllWithoutPagination() {
    try {
      return await this.prismaService.taiKhoan.findMany({
        include: {
          nhanVien: true,
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
      total = await this.prismaService.taiKhoan.count();
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
    let bankerList;
    try {
      bankerList = await this.prismaService.taiKhoan.findMany({
        skip: (pagination.page - 1) * pagination.size,
        take: pagination.size,
        include: {
          nhanVien: true,
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

    return formatResponse(pagination, total, lastPage, bankerList, 'bankers');
  }

  //id: mã tài khoản
  async findOne(id: number) {
    let banker;
    try {
      banker = await this.prismaService.taiKhoan.findUnique({
        where: {
          maTK: id,
        },
        include: {
          nhanVien: true,
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

  //id: mã tài khoản
  async update(id: number, updateBankerDto: UpdateBankerDto) {
    let banker;
    try {
      banker = await this.prismaService.taiKhoan.update({
        data: {
          nhanVien: {
            updateMany: {
              data: {
                hoTen: updateBankerDto.hoTen,
                sdt: updateBankerDto.sdt,
              },
              where: { maTK: id },
            },
          },
        },
        where: { maTK: id },
        select: {
          nhanVien: true,
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

  //TODO: will implement after the table changes
  remove(id: number) {
    return `This action removes a #${id} banker`;
  }
}
