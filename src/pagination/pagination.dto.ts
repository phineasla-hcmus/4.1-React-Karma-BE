import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { DEFAULT_PAGINATION_PAGE, DEFAULT_PAGINATION_SIZE } from '../constants';

export class PaginationDto {
  @ApiProperty({
    description:
      'A non-zero, non-negative integer representing the page of the results',
    default: 1,
    minimum: 1,
  })
  @ApiPropertyOptional()
  page: number = DEFAULT_PAGINATION_PAGE;

  @ApiProperty({
    description:
      'A non-zero, non-negative integer indicating the maximum number of results to return at one time',
    default: 25,
  })
  @ApiPropertyOptional()
  size: number = DEFAULT_PAGINATION_SIZE;
}
