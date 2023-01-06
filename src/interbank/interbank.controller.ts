import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Pagination, PaginationDto } from '../pagination';

import { QueryDTO } from './dto/query.dto';
import { InterbankService } from './interbank.service';

@ApiTags('interbank')
@Controller('interbank')
export class InterbankController {
  constructor(private interbankService: InterbankService) {}

  @Get('account')
  async getAccount(@Query('account_no') account_no: string) {
    if (account_no) {
      const user = await this.interbankService.getPaymentAccountInfo(
        account_no,
      );
      if (!user) {
        throw new BadRequestException({
          errorId: HttpStatus.NOT_FOUND,
          message: 'Account not found',
        });
      }
      return user;
    } else {
      throw new BadRequestException({
        errorId: HttpStatus.BAD_REQUEST,
        message: 'Invalid account_no',
      });
    }
  }

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
  async findAllWithPagination(
    @Pagination() pagination: PaginationDto,
    @Query() query: QueryDTO,
  ) {
    try {
      return this.interbankService.findAllWithPagination(pagination, query);
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
