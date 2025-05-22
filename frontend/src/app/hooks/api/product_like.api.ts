import { API_ROUTES } from "@/app/configs/route.config";
import { HttpClient } from "@/app/hooks/api";
import { BaseApiQueryType, BaseApiResponseType } from "@/app/types/common.type";
import { Product_LikeType } from "@/app/types/product_like.type";

export const product_likeClient = {
  findAll: (params?: BaseApiQueryType) => {
    return HttpClient.get<BaseApiResponseType>(
      API_ROUTES.PRODUCT_LIKE.INDEX,
      params
    );
  },
  findOne: (id: string) => {
    return HttpClient.get<Product_LikeType>(
      `${API_ROUTES.PRODUCT_LIKE.INDEX}/${id}`
    );
  },
  create: (payload?: Record<string, any>) => {
    return HttpClient.post<Product_LikeType>(
      API_ROUTES.PRODUCT_LIKE.INDEX,
      payload
    );
  },
  check_like: (data: { userId: string; productId: string }) => {
    return HttpClient.post<{ status: boolean }>(
      `${API_ROUTES.PRODUCT_LIKE.INDEX}/check_like`,
      data
    );
  },
  update: (payload: { id: string } & Record<string, any>) => {
    return HttpClient.patch<Product_LikeType>(
      `${API_ROUTES.PRODUCT_LIKE.INDEX}/${payload?.id}`,
      payload
    );
  },
  delete: (id: string) => {
    return HttpClient.delete(`${API_ROUTES.PRODUCT_LIKE.INDEX}/${id}`);
  },
};
