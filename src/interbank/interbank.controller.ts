import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { Pagination, PaginationDto } from '../pagination';

import { InterbankService } from './interbank.service';

@Controller('interbank')
export class InterbankController {
  constructor(private readonly interbankService: InterbankService) {}

  @Get('all')
  async findAllWithoutPagination() {
    try {
      const data = await this.interbankService.findAllWithoutPagination();
      return { data };
    } catch (e) {
      throw e;
    }
  }

  @Get()
  async findAllWithPagination(@Pagination() pagination: PaginationDto) {
    try {
      return this.interbankService.findAllWithPagination(pagination);
    } catch (e) {
      throw e;
    }
  }

  @Get('statistic')
  findStatistic() {
    try {
      return this.interbankService.findStatistic();
    } catch (e) {
      throw e;
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.interbankService.findOne(id);
    } catch (e) {
      throw e;
    }
  }
}
