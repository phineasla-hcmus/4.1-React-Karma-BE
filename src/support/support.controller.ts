import { Controller, Get, Query } from '@nestjs/common';
import { SupportService } from './support.service';

@Controller('support')
export class SupportController {
  constructor(private supportService: SupportService) {}
  @Get()
  async getAccount(@Query('account_no') account_no: string) {
    if (account_no) {
      return await this.supportService.getPaymentAccountInfo(account_no);
    }
  }
}
