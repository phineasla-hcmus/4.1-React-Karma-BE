import { Inject, Injectable } from '@nestjs/common';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

import { AXIOS_INSTANCE_TOKEN } from './axios.constants';

@Injectable()
export class AxiosService {
  constructor(
    @Inject(AXIOS_INSTANCE_TOKEN) protected readonly instance: AxiosInstance,
  ) {}

  request<T = any>(config: AxiosRequestConfig) {
    return this.instance.request<T>(config);
  }

  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.instance.get<T>(url, config);
  }

  head<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.instance.head<T>(url, config);
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.post<T>(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.put<T>(url, data, config);
  }

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.patch<T>(url, data, config);
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete<T>(url, config);
  }

  get axios() {
    return this.instance;
  }
}
