import api from "@/app/providers/ApiProvider";

export * from "./product.api";
export * from "./product.hook";
export * from "./category.api";
export * from "./category.hook";
export * from "./subcategory.api";
export * from "./subcategory.hook";

import { AxiosRequestConfig } from "axios";

export class HttpClient {
  static async get<T>(url: string, params?: any) {
    const res = await api.get<T>(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, {
      params,
    });

    return res.data;
  }

  static async post<T>(
    url: string,
    payload?: any,
    config?: AxiosRequestConfig
  ) {
    const res = await api.post<T>(
      `${process.env.NEXT_PUBLIC_API_URL}/${url}`,
      payload,
      config
    );

    return res.data;
  }

  static async patch<T>(
    url: string,
    payload?: any,
    config?: AxiosRequestConfig
  ) {
    const res = await api.patch<T>(
      `${process.env.NEXT_PUBLIC_API_URL}/${url}`,
      payload,
      config
    );

    return res.data;
  }

  static async delete<T>(url: string) {
    const res = await api.delete<T>(
      `${process.env.NEXT_PUBLIC_API_URL}/${url}`
    );

    return res.data;
  }
}
