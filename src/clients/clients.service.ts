import { faker } from '@faker-js/faker';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime';
import * as bcrypt from 'bcrypt';

import { formatResponse, PaginationDto } from '../pagination';
import { PrismaService } from '../prisma/prisma.service';

import { CreateUserDto } from './dto/create-client.dto';
import { UpdateUserDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  private readonly logger: Logger = new Logger(ClientsService.name);

  constructor(private prismaService: PrismaService) {}

  private handleError(e: unknown) {
    if (e instanceof PrismaClientKnownRequestError) {
      this.logger.error(`${e.code}: ${e.message}`, e.stack);
    } else if (e instanceof PrismaClientUnknownRequestError) {
      this.logger.error(e.message, e.stack);
    } else {
      this.logger.error(e);
    }
    throw e;
  }

  async create(createUserDto: CreateUserDto) {
    const tenDangNhap = faker.random.numeric(8);
    const matKhau = bcrypt.hashSync(tenDangNhap, 10);
    const soTK = tenDangNhap;
    try {
      const data = await this.prismaService.taiKhoan.create({
        data: {
          tenDangNhap,
          matKhau,
          vaiTro: 'User',
          khachHang: {
            create: {
              hoTen: createUserDto.hoTen,
              sdt: createUserDto.sdt,
              email: createUserDto.email,
            },
          },
          taiKhoanThanhToan: {
            create: {
              soTK,
              soDu: 0,
            },
          },
        },
        include: {
          khachHang: true,
          taiKhoanThanhToan: true,
        },
      });
      return { ...data, id: data.maTK };
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
      const data = await this.prismaService.taiKhoan.findMany({
        where: {
          vaiTro: 'User',
          hoatDong: true,
        },
        include: {
          khachHang: true,
        },
      });

      return data.map(({ ...props }) => ({
        ...props,
        id: props.maTK,
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

  async findAllWithPagination(pagination: PaginationDto) {
    let total;
    try {
      total = await this.prismaService.taiKhoan.count({
        where: {
          vaiTro: 'User',
          hoatDong: true,
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
    let userList;
    try {
      const data = await this.prismaService.taiKhoan.findMany({
        skip: (pagination.page - 1) * pagination.size,
        take: pagination.size,
        where: {
          vaiTro: 'User',
          hoatDong: true,
        },
        include: {
          khachHang: true,
        },
      });

      userList = data.map(({ ...props }) => ({
        ...props,
        id: props.maTK,
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
    const lastPage = Math.ceil(total / pagination.size);

    return formatResponse(pagination, total, lastPage, userList, 'clients');
  }

  /**
   *
   * @param id Mã tài khoản
   */
  async findOne(id: number) {
    let user;
    try {
      const data = await this.prismaService.taiKhoan.findUnique({
        where: {
          maTK: id,
        },
        include: {
          khachHang: true,
        },
      });
      user = { id: data.maTK, ...data };
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException({
          errorId: e.name,
          message: e.message,
          stack: e.stack,
        });
      }
    }

    if (!user) {
      throw new NotFoundException({
        errorId: 'id_not_found',
        message: 'Id not found',
      });
    }
    return user;
  }

  async findOneByPaymentAccount(
    soTK: string,
    options?: { include: Prisma.taiKhoanInclude },
  ) {
    try {
      return await this.prismaService.taiKhoan.findFirst({
        where: { taiKhoanThanhToan: { soTK } },
        include: options?.include,
      });
    } catch (e) {
      this.handleError(e);
    }
  }

  /**
   *
   * @param id Mã tài khoản
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const data = await this.prismaService.khachHang.update({
        data: {
          hoTen: updateUserDto.hoTen,
          sdt: updateUserDto.sdt,
          email: updateUserDto.email,
        },
        where: { maTK: id },
      });

      return { data, id: data.maTK };
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

  async remove(id: number) {
    try {
      await this.prismaService.$transaction([
        this.prismaService.taiKhoan.updateMany({
          data: {
            hoatDong: false,
          },
          where: {
            maTK: id,
          },
        }),
        this.prismaService.taiKhoanThanhToan.updateMany({
          data: {
            hoatDong: false,
          },
          where: { maTK: id },
        }),
      ]);
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
