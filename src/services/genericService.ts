import { AxiosRequestConfig, AxiosResponse } from "axios";
import { api } from "./api"; // caminho relativo ao seu projeto

export class GenericService<T> {
  constructor(private endpoint: string) {}

  get(
    id?: string | number,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const url = id ? `${this.endpoint}/${id}` : this.endpoint;
    return api.get<T>(url, config);
  }

  post(data: T, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return api.post<T>(this.endpoint, data, config);
  }

  put(
    id: string | number,
    data: Partial<T>,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return api.put<T>(`${this.endpoint}/${id}`, data, config);
  }

  patch(
    id: string | number,
    data: Partial<T>,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return api.patch<T>(`${this.endpoint}/${id}`, data, config);
  }

  delete(
    id: string | number,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<void>> {
    return api.delete(`${this.endpoint}/${id}`, config);
  }
}
