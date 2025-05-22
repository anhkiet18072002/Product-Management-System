import { API_ROUTES } from "@/app/configs/route.config";
import { HttpClient } from "@/app/hooks/api";
import { BaseApiQueryType, BaseApiResponseType } from "@/app/types/common.type";
import { SubcategoryType } from "@/app/types/subcategory.type";

export const subcategoryClient = {
  findAll: (params?: BaseApiQueryType) => {
    return HttpClient.get<BaseApiResponseType>(
      API_ROUTES.SUBCATEGORY.INDEX,
      params
    );
  },
  findOne: (id: string) => {
    return HttpClient.get<SubcategoryType>(
      `${API_ROUTES.SUBCATEGORY.INDEX}/${id}`
    );
  },
  create: (payload?: Record<string, any>) => {
    return HttpClient.post<SubcategoryType>(
      API_ROUTES.SUBCATEGORY.INDEX,
      payload
    );
  },
  update: (payload: { id: string } & Record<string, any>) => {
    return HttpClient.patch<SubcategoryType>(
      `${API_ROUTES.SUBCATEGORY.INDEX}/${payload?.id}`,
      payload
    );
  },
  delete: (id: string) => {
    return HttpClient.delete(`${API_ROUTES.SUBCATEGORY.INDEX}/${id}`);
  },
};
