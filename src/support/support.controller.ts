import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { SupportService } from './support.service';

@Controller('support')
export class SupportController {
  constructor(private supportService: SupportService) {}
  @Get()
  async getAccount(@Query('account_no') account_no: string) {
    if (account_no) {
      try {
        const user = await this.supportService.getPaymentAccountInfo(
          account_no,
        );
        return user;
      } catch (e) {
        throw e;
      }
    } else {
      throw new HttpException(
        {
          errorId: HttpStatus.BAD_REQUEST,
          message: 'Invalid account_no',
        },
        HttpStatus.OK,
      );
    }
  }
}
