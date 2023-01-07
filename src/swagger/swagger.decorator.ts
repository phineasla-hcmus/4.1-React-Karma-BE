import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiResponseMetadata,
  getSchemaPath,
} from '@nestjs/swagger';

import { PaginationDto } from '../pagination';

export interface ApiWrappedResponseMetadata
  extends Omit<ApiResponseMetadata, 'type' | 'isArray'> {
  type: Type<unknown>;
}

export const ApiWrappedResponse = (options: ApiWrappedResponseMetadata) => {
  const { type, ...omitted } = options;
  return applyDecorators(
    ApiExtraModels(type),
    ApiResponse({
      ...omitted,
      schema: {
        properties: {
          data: {
            $ref: getSchemaPath(type),
          },
        },
      },
    }),
  );
};

export const ApiOkWrappedResponse = (options: ApiWrappedResponseMetadata) =>
  ApiWrappedResponse({ ...options, status: HttpStatus.OK });

export const ApiCreatedWrappedResponse = (
  options: ApiWrappedResponseMetadata,
) => ApiWrappedResponse({ ...options, status: HttpStatus.CREATED });

export interface ApiPaginatedResponseMetadata
  extends Omit<ApiResponseMetadata, 'type' | 'isArray'> {
  type: Type<unknown>;
}

export const ApiPaginatedResponse = (options: ApiPaginatedResponseMetadata) => {
  const { type, ...omitted } = options;
  return applyDecorators(
    ApiExtraModels(PaginationDto),
    ApiResponse({
      ...omitted,
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
                items: { $ref: getSchemaPath(type) },
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiOkPaginatedResponse = (options: ApiPaginatedResponseMetadata) =>
  ApiPaginatedResponse({ ...options, status: HttpStatus.OK });
