import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';

import { Pagination, PaginationDto } from '../pagination';

import { TransactionsService } from './transactions.service';
import { TransactionQueryDTO } from './dto/transactions.query.dto';

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
  async findAllWithPagination(
    @Pagination() pagination: PaginationDto,
    @Query() query: TransactionQueryDTO,
  ) {
    console.log(query);

    try {
      return this.transactionsService.findAllWithPagination(pagination, query);
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
}
