import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';

import { Pagination, PaginationDto } from '../pagination';

import { RequestTransactionDto } from './dto/request-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('all')
  async findAllWithoutPagination() {
    try {
      const data = await this.transactionsService.findAllWithoutPagination();
      return { data };
    } catch (e) {
      throw e;
    }
  }

  @Get()
  async findAllWithPagination(@Pagination() pagination: PaginationDto) {
    try {
      return this.transactionsService.findAllWithPagination(pagination);
    } catch (e) {
      throw e;
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.transactionsService.findOne(id);
    } catch (e) {
      throw e;
    }
  }

  @Post('request')
  async requestTransaction({
    soTK,
    nguoiNhan,
    soTien,
  }: RequestTransactionDto) {}
}
