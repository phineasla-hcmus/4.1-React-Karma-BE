import { Injectable, InternalServerErrorException } from '@nestjs/common';

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

  findAll() {
    return `This action returns all bankers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} banker`;
  }

  update(id: number, updateBankerDto: UpdateBankerDto) {
    return `This action updates a #${id} banker`;
  }

  remove(id: number) {
    return `This action removes a #${id} banker`;
  }
}
