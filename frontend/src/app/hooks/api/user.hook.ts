import { API_ROUTES } from "@/app/configs/route.config";
import { useMutation, useQuery } from "react-query";
import { BaseApiQueryType, BaseApiResponseType } from "@/app/types/common.type";
import { userClient } from "./user.api";
import { UserType } from "@/app/types/user.type";

const useAddUser = () => {
  return useMutation(userClient.create);
};

const useEditUser = () => {
  return useMutation(userClient.update);
};

const useGetUsers = (query: BaseApiQueryType) => {
  return useQuery<BaseApiResponseType>(
    [API_ROUTES.USER.INDEX, query],
    () => userClient.findAll(query),
    {
      refetchOnWindowFocus: false,
    }
  );
};
const useGetUser = (id: string) => {
  return useQuery<UserType>(
    [`${API_ROUTES.USER.INDEX}/${id}`],
    () => userClient.findOne(id),
    {
      refetchOnWindowFocus: false,
    }
  );
};

const useDeleteUser = () => {
  return useMutation(userClient.delete);
};

export { useAddUser, useEditUser, useGetUser, useGetUsers, useDeleteUser };
