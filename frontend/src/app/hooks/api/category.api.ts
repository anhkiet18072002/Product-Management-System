import { API_ROUTES } from "@/app/configs/route.config";
import { HttpClient } from "@/app/hooks/api";
import { CategoryType } from "@/app/types/category.type";
import { BaseApiQueryType, BaseApiResponseType } from "@/app/types/common.type";

export const categoryClient = {
  findAll: (params?: BaseApiQueryType) => {
    return HttpClient.get<BaseApiResponseType>(
      API_ROUTES.CATEGORY.INDEX,
      params
    );
  },
  findOne: (id: string) => {
    return HttpClient.get<CategoryType>(`${API_ROUTES.CATEGORY.INDEX}/${id}`);
  },
  create: (payload?: Record<string, any>) => {
    return HttpClient.post<CategoryType>(API_ROUTES.CATEGORY.INDEX, payload);
  },
  update: (payload: { id: string } & Record<string, any>) => {
    return HttpClient.patch<CategoryType>(
      `${API_ROUTES.CATEGORY.INDEX}/${payload?.id}`,
      payload
    );
  },
  delete: (id: string) => {
    return HttpClient.delete(`${API_ROUTES.CATEGORY.INDEX}/${id}`);
  },
};
