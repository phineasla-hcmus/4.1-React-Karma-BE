import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import isInt from 'validator/lib/isInt';
import toInt from 'validator/lib/toInt';

import {
  PAGINATION_MIN_PAGE,
  PAGINATION_MIN_SIZE,
  DEFAULT_PAGINATION_PAGE,
  DEFAULT_PAGINATION_SIZE,
} from '../constants';

import { PaginationDto } from './pagination.dto';

interface PaginationRawDto {
  page: string | string[] | number;
  size: string | string[] | number;
}

@Injectable()
export class PaginationPipe
  implements PipeTransform<PaginationRawDto, PaginationDto>
{
  transform(value: PaginationRawDto, metadata: ArgumentMetadata) {
    const page = this.sanitize(
      metadata.type,
      'page',
      value.page,
      PAGINATION_MIN_PAGE,
      DEFAULT_PAGINATION_PAGE,
    );
    const size = this.sanitize(
      metadata.type,
      'size',
      value.size,
      PAGINATION_MIN_SIZE,
      DEFAULT_PAGINATION_SIZE,
    );
    const errors = [page, size]
      .filter((query) => query.error)
      .map((query) => query.error);
    if (errors.length !== 0) {
      throw new BadRequestException({
        errorId: 'bad_pagination',
        message: 'Invalid pagination query received',
        details: errors,
      });
    }
    return { page: page.value, size: size.value };
  }

  protected sanitize(
    location: string,
    field: string,
    value: string | string[] | number,
    min: number,
    defaultValue: number,
  ) {
    if (value == null) {
      return { value: defaultValue };
    }
    if (typeof value === 'number') {
      return { value };
    }
    const v = Array.isArray(value) ? value[0] : value;
    if (isInt(v, { min })) {
      return { value: toInt(v) };
    }
    return { error: { location, field, value }, value: NaN };
  }
}
