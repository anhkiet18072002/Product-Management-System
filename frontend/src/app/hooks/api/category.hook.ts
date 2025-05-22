import { API_ROUTES } from "@/app/configs/route.config";
import { useMutation, useQuery } from "react-query";
import { BaseApiQueryType, BaseApiResponseType } from "@/app/types/common.type";
import { categoryClient } from "./category.api";
import { CategoryType } from "@/app/types/category.type";

const useAddCategory = () => {
  return useMutation(categoryClient.create);
};

const useEditCategory = () => {
  return useMutation(categoryClient.update);
};

const useGetCategories = (query: BaseApiQueryType) => {
  return useQuery<BaseApiResponseType>(
    [API_ROUTES.CATEGORY.INDEX, query],
    () => categoryClient.findAll(query),
    {
      refetchOnWindowFocus: false,
    }
  );
};
const useGetCategory = (id: string) => {
  return useQuery<CategoryType>(
    [`${API_ROUTES.CATEGORY.INDEX}/${id}`],
    () => categoryClient.findOne(id),
    {
      refetchOnWindowFocus: false,
    }
  );
};

const useDeleteCategory = () => {
  return useMutation(categoryClient.delete);
};

export {
  useAddCategory,
  useEditCategory,
  useGetCategory,
  useGetCategories,
  useDeleteCategory,
};
