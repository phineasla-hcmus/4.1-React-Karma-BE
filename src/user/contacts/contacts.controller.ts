import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';

import { JwtUser } from '../../jwt/jwt.decorator';
import { JwtUserDto } from '../../jwt/jwt.dto';

import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get('all')
  async findAllWithoutPagination(@JwtUser() user: JwtUserDto) {
    const { maTK } = user;
    const data = await this.contactsService.findAllWithoutPagination(maTK);
    return { data };
  }

  @Post()
  async create(
    @JwtUser() user: JwtUserDto,
    @Body() createContactsDto: CreateContactDto,
  ) {
    const { maTK } = user;
    const data = await this.contactsService.create(maTK, createContactsDto);
    return { data };
  }

  @Patch(':nguoiDung')
  async update(
    @JwtUser() user: JwtUserDto,
    @Param('nguoiDung') nguoiDung: string,
    @Body() updateContactsDto: UpdateContactDto,
  ) {
    const { maTK } = user;
    const contact = await this.contactsService.findOne({
      maTK: maTK,
      nguoiDung: nguoiDung,
    });
    if (!contact) {
      throw new BadRequestException({
        errorId: 'bad_request',
        message: 'Invalid request for creating contact',
      });
    }
    const data = await this.contactsService.update(
      maTK,
      nguoiDung,
      updateContactsDto,
    );
    return { data };
  }

  @Delete(':id')
  async remove(
    @JwtUser() user: JwtUserDto,
    @Param('nguoiDung') nguoiDung: string,
  ) {
    const { maTK } = user;
    const contact = await this.contactsService.findOne({
      maTK: maTK,
      nguoiDung: nguoiDung,
    });
    if (!contact) {
      throw new BadRequestException({
        errorId: 'bad_request',
        message: 'Invalid request for creating contact',
      });
    }
    const data = await this.contactsService.remove(maTK, nguoiDung);
    return { data };
  }
}
