import { API_ROUTES } from "@/app/configs/route.config";
import { useMutation, useQuery } from "react-query";
import { BaseApiQueryType, BaseApiResponseType } from "@/app/types/common.type";
import { subcategoryClient } from "./subcategory.api";
import { SubcategoryType } from "@/app/types/subcategory.type";

const useAddSubcategory = () => {
  return useMutation(subcategoryClient.create);
};

const useEditSubcategory = () => {
  return useMutation(subcategoryClient.update);
};

const useGetSubcategories = (query: BaseApiQueryType) => {
  return useQuery<BaseApiResponseType>(
    [API_ROUTES.SUBCATEGORY.INDEX, query],
    () => subcategoryClient.findAll(query),
    {
      refetchOnWindowFocus: false,
    }
  );
};
const useGetSubcategory = (id: string) => {
  return useQuery<SubcategoryType>(
    [`${API_ROUTES.SUBCATEGORY.INDEX}/${id}`],
    () => subcategoryClient.findOne(id),
    {
      refetchOnWindowFocus: false,
    }
  );
};

const useDeleteSubcategory = () => {
  return useMutation(subcategoryClient.delete);
};

export {
  useAddSubcategory,
  useEditSubcategory,
  useGetSubcategories,
  useGetSubcategory,
  useDeleteSubcategory,
};
