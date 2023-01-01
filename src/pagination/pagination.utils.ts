import { PaginationDto } from './pagination.dto';

export const formatResponse = (
  pagination: PaginationDto,
  total: number,
  lastPage: number,
  data: any,
  resource: string,
) => {
  const baseUrl = process.env.BASE_URL;
  const next =
    pagination.page < lastPage
      ? {
          href: `${baseUrl}/v1/${resource}?page=${pagination.page + 1}&size=${
            pagination.size
          }`,
        }
      : undefined;
  return {
    page: pagination.page,
    total,
    size: pagination.size,
    links: {
      self: {
        href: `${baseUrl}/v1/${resource}?page=${pagination.page}&size=${pagination.size}`,
      },
      next,
      last: {
        href: `${baseUrl}/v1/${resource}?page=${lastPage}&size=${pagination.size}`,
      },
    },
    data,
  };
};
