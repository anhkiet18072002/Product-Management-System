import { API_ROUTES } from "@/app/configs/route.config";
import { useMutation, useQuery } from "react-query";
import { productClient } from ".";
import { BaseApiQueryType, BaseApiResponseType } from "@/app/types/common.type";
import { ProductType } from "@/app/types";

const useAddProduct = () => {
  return useMutation(productClient.create);
};

const useLikeProduct = () => {
  return useMutation(productClient.like_feature);
};

const useEditProduct = () => {
  return useMutation(productClient.update);
};

const useGetProducts = (query: BaseApiQueryType) => {
  return useQuery<BaseApiResponseType>(
    [API_ROUTES.PRODUCT.INDEX, query],
    () => productClient.findAll(query),
    {
      refetchOnWindowFocus: false,
    }
  );
};
const useGetProduct = (id: string) => {
  return useQuery<ProductType>(
    [`${API_ROUTES.PRODUCT.INDEX}/${id}`],
    () => productClient.findOne(id),
    {
      refetchOnWindowFocus: false,
    }
  );
};

const useDeleteProduct = () => {
  return useMutation(productClient.delete);
};

export {
  useAddProduct,
  useEditProduct,
  useGetProduct,
  useGetProducts,
  useDeleteProduct,
  useLikeProduct,
};
