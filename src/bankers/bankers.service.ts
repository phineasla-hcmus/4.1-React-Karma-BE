import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { RechargeDto } from '../bankers/dto/recharge.dto';
import { formatResponse, PaginationDto } from '../pagination';
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
      const data = await this.prismaService.taiKhoan.findMany({
        where: {
          vaiTro: 'Banker',
          hoatDong: true,
        },
        include: {
          nhanVien: true,
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
          vaiTro: 'Banker',
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
    let bankerList;
    try {
      const data = await this.prismaService.taiKhoan.findMany({
        skip: (pagination.page - 1) * pagination.size,
        take: pagination.size,
        where: {
          vaiTro: 'Banker',
          hoatDong: true,
        },
        include: {
          nhanVien: true,
        },
      });

      bankerList = data.map(({ ...props }) => ({
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

    return formatResponse(pagination, total, lastPage, bankerList, 'bankers');
  }

  //id: mã tài khoản
  async findOne(id: number) {
    let banker;
    try {
      const data = await this.prismaService.taiKhoan.findUnique({
        where: {
          maTK: id,
        },
        include: {
          nhanVien: true,
        },
      });
      banker = { id: data.maTK, ...data };
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
    try {
      const data = await this.prismaService.nhanVien.update({
        data: {
          hoTen: updateBankerDto.hoTen,
          sdt: updateBankerDto.sdt,
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

  //id: mã nhân viên
  async recharge(id: number, rechangeDto: RechargeDto) {
    // dùng số tài khoản
    if (rechangeDto.soTK) {
      const user = await this.prismaService.taiKhoanThanhToan.findUnique({
        where: {
          soTK: rechangeDto.soTK,
        },
      });
      if (!user) {
        throw new NotFoundException();
      }
      try {
        await this.prismaService.$transaction([
          this.prismaService.lichSuNapTien.create({
            data: {
              maNV: id,
              soTK: rechangeDto.soTK,
              soTien: rechangeDto.soTienThem,
            },
          }),
          this.prismaService.taiKhoanThanhToan.update({
            data: {
              soDu: user.soDu + rechangeDto.soTienThem,
            },
            where: {
              soTK: rechangeDto.soTK,
            },
          }),
        ]);

        return { data: { status: HttpStatus.OK } };
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

    // dùng tên đăng nhập (username)
    else if (rechangeDto.tenDangNhap) {
      let bankAccountUser: any;
      // use username to find an account in "taiKhoan"
      const accountUser = await this.prismaService.taiKhoan.findUnique({
        where: {
          tenDangNhap: rechangeDto.tenDangNhap,
        },
      });

      // use id from account in "taiKhoan" to find a suitable account in "taiKhoanThanhToan"
      if (accountUser) {
        bankAccountUser = await this.prismaService.taiKhoanThanhToan.findUnique(
          {
            where: {
              maTK: accountUser.maTK,
            },
          },
        );
      }

      if (!bankAccountUser) {
        throw NotFoundException;
      }

      try {
        await this.prismaService.$transaction([
          this.prismaService.lichSuNapTien.create({
            data: {
              maNV: id,
              soTK: bankAccountUser.soTK,
              soTien: rechangeDto.soTienThem,
            },
          }),
          this.prismaService.taiKhoanThanhToan.update({
            data: {
              soDu: bankAccountUser.soDu + rechangeDto.soTienThem,
            },
            where: {
              soTK: bankAccountUser.soTK,
            },
          }),
        ]);

        return { data: { status: HttpStatus.OK } };
      } catch (e) {
        if (e instanceof Error) {
          throw new InternalServerErrorException({
            errorId: e.name,
            message: e.message,
            stack: e.stack,
          });
        }
      }
    } else {
      throw new NotFoundException();
    }
  }
}
