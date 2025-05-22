import { API_ROUTES } from "@/app/configs/route.config";
import { useMutation, useQuery } from "react-query";
import { BaseApiQueryType, BaseApiResponseType } from "@/app/types/common.type";
import { product_likeClient } from "./product_like.api";
import { Product_LikeType } from "@/app/types/product_like.type";

const useAddProduct_like = () => {
  return useMutation(product_likeClient.create);
};

const useCheckLikeProduct_like = () => {
  return useMutation(product_likeClient.check_like);
};

const useEditProduct_like = () => {
  return useMutation(product_likeClient.update);
};

const useGetProduct_likes = (query: BaseApiQueryType) => {
  return useQuery<BaseApiResponseType>(
    [API_ROUTES.PRODUCT.INDEX, query],
    () => product_likeClient.findAll(query),
    {
      refetchOnWindowFocus: false,
    }
  );
};
const useGetProduct_like = (id: string) => {
  return useQuery<Product_LikeType>(
    [`${API_ROUTES.PRODUCT.INDEX}/${id}`],
    () => product_likeClient.findOne(id),
    {
      refetchOnWindowFocus: false,
    }
  );
};

const useDeleteProduct_like = () => {
  return useMutation(product_likeClient.delete);
};

export {
  useAddProduct_like,
  useDeleteProduct_like,
  useGetProduct_like,
  useGetProduct_likes,
  useEditProduct_like,
  useCheckLikeProduct_like,
};
