import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';

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

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(PaginationDto),
    ApiOkResponse({
      description: 'Successfully received model list',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationDto) },
          {
            properties: {
              total: {
                type: 'number',
              },
              links: {
                properties: {
                  self: {
                    properties: {
                      href: {
                        type: 'string',
                      },
                    },
                  },
                  next: {
                    properties: {
                      href: {
                        type: 'string',
                      },
                    },
                  },
                  last: {
                    properties: {
                      href: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
