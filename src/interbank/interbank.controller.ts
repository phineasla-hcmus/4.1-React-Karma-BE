import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { Pagination, PaginationDto } from '../pagination';
import {
  ApiOkWrappedResponse,
  ApiPaginatedResponse,
} from '../swagger/swagger.decorator';

import {
  BankResponseDto,
  InterbankResponseDto,
  InterbankTransferResponseDto,
} from './dto/interbank.response.dto';
import { InterbankTransactionQueryDto } from './dto/query.dto';
import { InterbankService } from './interbank.service';
import { transferDTO } from './transfer.dto';

@Controller('interbank')
export class InterbankController {
  constructor(private interbankService: InterbankService) {}

  @Get('account')
  @ApiOperation({
    summary: 'Fetch an interbank account info',
  })
  @ApiTags('API cho liên ngân hàng')
  @ApiOkWrappedResponse({
    type: InterbankResponseDto,
    description: 'Successfully fetched an interbank account info',
  })
  @ApiQuery({ name: 'soTK', type: 'string' })
  async getAccount(@Query('soTK') account_no: string) {
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
  @ApiTags('interbank')
  @ApiOperation({
    summary: 'Fetch a non-paginated list of interbank transfer',
  })
  @ApiOkWrappedResponse({
    description:
      'Successfully received a non-paginated list of interbank transfer',
    type: InterbankTransferResponseDto,
  })
  async findAllWithoutPagination() {
    try {
      const data = await this.interbankService.findAllWithoutPagination();
      return { data };
    } catch (e) {
      throw e;
    }
  }

  @Get()
  @ApiTags('interbank')
  @ApiOperation({
    summary: 'Fetch a paginated list of interbank transfer',
  })
  @ApiPaginatedResponse({ type: InterbankTransferResponseDto })
  async findAllWithPagination(
    @Pagination() pagination: PaginationDto,
    @Query() query: InterbankTransactionQueryDto,
  ) {
    console.log(query.from);

    try {
      return this.interbankService.findAllWithPagination(pagination, query);
    } catch (e) {
      throw e;
    }
  }

  @Get(':maCKN')
  @ApiTags('interbank')
  @ApiOperation({
    summary: 'Get detail of an interbank transfer',
  })
  @ApiParam({
    name: 'maCKN',
    description: 'Mã chuyển khoản ngoài',
    type: 'number',
  })
  @ApiOkResponse({
    description: 'Successfully fetched a record of interbank transfer',
    type: InterbankTransferResponseDto,
  })
  findOne(@Param('maCKN', ParseIntPipe) id: number) {
    try {
      return this.interbankService.findOne(id);
    } catch (e) {
      throw e;
    }
  }

  @Post('transfer')
  async externalBankTransfer(@Body() body: transferDTO) {
    return await this.interbankService.externalBankTransfer(body);
  }
}
