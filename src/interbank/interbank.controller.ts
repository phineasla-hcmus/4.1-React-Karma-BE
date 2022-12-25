import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { InterbankService } from './interbank.service';

@Controller('interbank')
export class InterbankController {
  constructor(private interbankService: InterbankService) {}
  @Get()
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
}
