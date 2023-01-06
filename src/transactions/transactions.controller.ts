import {
  Query,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { REQUEST_TRANSACTION_OTP_RATE } from '../constants';
import {
  ApiPaginatedResponse,
  ApiWrapResponse,
  Pagination,
  PaginationDto,
} from '../pagination';

import { RequestTransactionDto } from './dto/request-transaction.dto';
import { ResponseTransactionDto } from './dto/transaction.response.dto';
import { TransactionQueryDTO } from './dto/transactions.query.dto';
import { TransactionEmailService } from './transactionEmail.service';
import { TransactionOtpService } from './transactionOtp.service';
import { TransactionsService } from './transactions.service';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly transactionOtpService: TransactionOtpService,
    private readonly transactionEmailService: TransactionEmailService,
  ) {}

  @Post('request')
  // @ApiOperation({
  //   summary: 'Create a banker',
  // })
  // @ApiOkResponse({
  //   description: 'Return information of the created banker',
  //   type: BankerResponseDto,
  // })
  async requestTransaction({ soTK, nguoiNhan, soTien }: RequestTransactionDto) {
    const otp = await this.transactionOtpService.findOne(soTK).catch(() => {
      throw new InternalServerErrorException({
        errorId: 'database_error',
        message: 'Something went wrong',
      });
    });
    if (
      otp &&
      Date.now() - otp.ngayTao.getTime() < REQUEST_TRANSACTION_OTP_RATE
    ) {
      throw new HttpException(
        {
          errorId: 'too_many_requests',
          message: 'You have sent too many transaction request',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    const newOtp = await this.transactionOtpService.upsert({
      soTK,
      nguoiNhan,
      soTien,
    });
    this.transactionEmailService.sendEmail(soTK, newOtp.otp);
    return { data: { status: HttpStatus.OK } };
  }

  @Get('all')
  @ApiOperation({
    summary: 'Fetch a non-paginated list of transactions',
  })
  @ApiWrapResponse(ResponseTransactionDto)
  async findAllWithoutPagination(@Body() res: ResponseTransactionDto) {
    try {
      const data = await this.transactionsService.findAllWithoutPagination();
      return { data };
    } catch (e) {
      throw e;
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Fetch a paginated list of transactions',
  })
  @ApiPaginatedResponse(ResponseTransactionDto)
  async findAllWithPagination(
    @Pagination() pagination: PaginationDto,
    @Query() query: TransactionQueryDTO,
  ) {
    try {
      return this.transactionsService.findAllWithPagination(pagination, query);
    } catch (e) {
      throw e;
    }
  }

  @Get(':maCK')
  @ApiOperation({
    summary: 'Fetch detailed data of a transaction',
  })
  @ApiParam({ name: 'maCK', description: 'Mã chuyển khoản', type: 'number' })
  @ApiOkResponse({
    description: 'Successfully return a record of transaction',
    type: ResponseTransactionDto,
  })
  findOne(@Param('maCK', ParseIntPipe) id: number) {
    try {
      return this.transactionsService.findOne(id);
    } catch (e) {
      throw e;
    }
  }
}
