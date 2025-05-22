import { API_ROUTES } from "@/app/configs/route.config";
import { HttpClient } from "@/app/hooks/api";
import { BaseApiQueryType, BaseApiResponseType } from "@/app/types/common.type";
import { UserType } from "@/app/types/user.type";

export const userClient = {
  findAll: (params?: BaseApiQueryType) => {
    return HttpClient.get<BaseApiResponseType>(API_ROUTES.USER.INDEX, params);
  },
  findOne: (id: string) => {
    return HttpClient.get<UserType>(`${API_ROUTES.USER.INDEX}/${id}`);
  },
  findByEmail: (email: string) => {
    return HttpClient.post<UserType>(API_ROUTES.USER.EMAIL, { email });
  },
  create: (payload?: Record<string, any>) => {
    return HttpClient.post<UserType>(API_ROUTES.USER.INDEX, payload);
  },
  update: (payload: { id: string } & Record<string, any>) => {
    return HttpClient.patch<UserType>(
      `${API_ROUTES.USER.INDEX}/${payload?.id}`,
      payload
    );
  },
  delete: (id: string) => {
    return HttpClient.delete(`${API_ROUTES.USER.INDEX}/${id}`);
  },
};
