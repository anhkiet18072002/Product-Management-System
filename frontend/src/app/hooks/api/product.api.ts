import { API_ROUTES } from "@/app/configs/route.config";
import { HttpClient } from "@/app/hooks/api";
import { ProductType } from "@/app/types";
import { BaseApiQueryType, BaseApiResponseType } from "@/app/types/common.type";

export const productClient = {
  findAll: (params?: BaseApiQueryType) => {
    return HttpClient.get<BaseApiResponseType>(
      API_ROUTES.PRODUCT.INDEX,
      params
    );
  },
  numberOfLike: (id: string) => {
    return HttpClient.get<ProductType>(
      `${API_ROUTES.PRODUCT.INDEX}/${id}/like`
    );
  },
  findOne: (id: string) => {
    return HttpClient.get<ProductType>(`${API_ROUTES.PRODUCT.INDEX}/${id}`);
  },
  create: (payload?: Record<string, any>) => {
    return HttpClient.post<ProductType>(API_ROUTES.PRODUCT.INDEX, payload);
  },
  like_feature: (data: { id: string; userId: string; productId: string }) => {
    return HttpClient.post<ProductType>(
      `${API_ROUTES.PRODUCT.INDEX}/${data.id}/like`,
      { ...data, id: undefined }
    );
  },
  update: (payload: { id: string } & Record<string, any>) => {
    return HttpClient.patch<ProductType>(
      `${API_ROUTES.PRODUCT.INDEX}/${payload?.id}`,
      payload
    );
  },
  delete: (id: string) => {
    return HttpClient.delete(`${API_ROUTES.PRODUCT.INDEX}/${id}`);
  },
};
