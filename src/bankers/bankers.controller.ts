import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { BankersService } from './bankers.service';
import { CreateBankerDto } from './dto/create-banker.dto';
import { UpdateBankerDto } from './dto/update-banker.dto';

@Controller('bankers')
export class BankersController {
  constructor(private readonly bankersService: BankersService) {}

  @Post()
  async create(@Body() createBankerDto: CreateBankerDto) {
    try {
      return await this.bankersService.create(createBankerDto);
    } catch (e) {
      throw e;
    }
  }

  @Get()
  findAll() {
    return this.bankersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bankersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBankerDto: UpdateBankerDto) {
    return this.bankersService.update(+id, updateBankerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bankersService.remove(+id);
  }
}
