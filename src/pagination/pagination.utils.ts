import { PaginationDto } from './pagination.dto';

export const formatResponse = (
  pagination: PaginationDto,
  total: number,
  lastPage: number,
  data: any,
  resource: string,
) => {
  if (pagination.page < lastPage) {
    return {
      page: pagination.page,
      total,
      size: pagination.size,
      links: {
        self: {
          href: `${process.env.DOMAIN}/v1/${resource}?page=${pagination.page}&size=${pagination.size}`,
        },
        next: {
          href: `${process.env.DOMAIN}/v1/${resource}?page=${
            pagination.page + 1
          }&size=${pagination.size}`,
        },
        last: {
          href: `${process.env.DOMAIN}/v1/${resource}?page=${lastPage}&size=${pagination.size}`,
        },
      },
      data,
    };
  }
  return {
    page: pagination.page,
    total,
    size: pagination.size,
    links: {
      self: {
        href: `${process.env.DOMAIN}/v1/${resource}?page=${pagination.page}&size=${pagination.size}`,
      },
      last: {
        href: `${process.env.DOMAIN}/v1/${resource}?page=${lastPage}&size=${pagination.size}`,
      },
    },
    data,
  };
};
