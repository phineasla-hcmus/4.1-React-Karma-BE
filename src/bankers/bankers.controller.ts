import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RechargeDto } from '../bankers/dto/recharge.dto';
import { ApiPaginatedResponse, Pagination, PaginationDto } from '../pagination';

import { BankersService } from './bankers.service';
import { CreateBankerDto } from './dto/create-banker.dto';
import { ResponseDto } from './dto/response.dto';
import { UpdateBankerDto } from './dto/update-banker.dto';

@ApiTags('bankers')
@Controller('bankers')
@ApiExtraModels(PaginationDto)
export class BankersController {
  constructor(private readonly bankersService: BankersService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Tạo banker thành công',
  })
  async create(@Body() createBankerDto: CreateBankerDto) {
    try {
      return await this.bankersService.create(createBankerDto);
    } catch (e) {
      throw e;
    }
  }

  @Get('all')
  // @ApiPaginatedResponse(ResponseDto)
  async findAllWithoutPagination() {
    try {
      const data = await this.bankersService.findAllWithoutPagination();
      return { data };
    } catch (e) {
      throw e;
    }
  }

  @Get()
  // @ApiPaginatedResponse(ResponseDto)
  async findAllWithPagination(@Pagination() pagination: PaginationDto) {
    try {
      const data = await this.bankersService.findAllWithPagination(pagination);
      return data;
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
  async remove(@Param('id') id: string) {
    await this.bankersService.remove(+id);
    return { data: { status: HttpStatus.OK } };
  }

  @Patch(':id/recharge')
  recharge(
    @Param('id', ParseIntPipe) id: number,
    @Body() rechargeDto: RechargeDto,
  ) {
    return this.bankersService.recharge(id, rechargeDto);
  }
}
