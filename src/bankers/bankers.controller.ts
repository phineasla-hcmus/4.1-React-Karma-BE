import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { Pagination, PaginationDto } from 'src/pagination';

import { BankersService } from './bankers.service';
import { CreateBankerDto } from './dto/create-banker.dto';
import { UpdateBankerDto } from './dto/update-banker.dto';

@Controller('bankers')
export class BankersController {
  constructor(private readonly bankersService: BankersService) {}

  @Post()
  async create(@Body() createBankerDto: CreateBankerDto) {
    try {
      return await this.bankersService.create(createBankerDto);
    } catch (e) {
      throw e;
    }
  }

  @Get('all')
  async findAllWithoutPagination() {
    try {
      return this.bankersService.findAllWithoutPagination();
    } catch (e) {
      throw e;
    }
  }

  @Get()
  async findAllWithPagination(@Pagination() pagination: PaginationDto) {
    try {
      return this.bankersService.findAllWithPagination(pagination);
    } catch (e) {
      throw e;
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.bankersService.findOne(id);
    } catch (e) {
      throw e;
    }
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBankerDto: UpdateBankerDto,
  ) {
    return this.bankersService.update(id, updateBankerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bankersService.remove(+id);
  }
}
