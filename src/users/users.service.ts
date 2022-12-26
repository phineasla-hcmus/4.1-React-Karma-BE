import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { formatResponse, PaginationDto } from '../pagination';
import { PrismaService } from '../prisma/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prismaService.taiKhoan.create({
        data: {
          tenDangNhap: createUserDto.tenDangNhap,
          matKhau: createUserDto.matKhau,
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
              soTK: createUserDto.soTK,
              soDu: 0,
            },
          },
        },
        include: {
          khachHang: true,
          taiKhoanThanhToan: true,
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
          nhanVien: true,
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

    return formatResponse(pagination, total, lastPage, userList, 'users');
  }

  //id: mã tài khoản
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

  //id: mã tài khoản
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
