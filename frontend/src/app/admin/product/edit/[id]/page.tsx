"use client";

import { ContainerStyled } from "@/styles/common.styles";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AddEdit from "../../AddEdit";
import { ProductType } from "@/app/types";
import { useGetProduct } from "@/app/hooks/api";

const Page = () => {
  const [product, setProduct] = useState<ProductType | undefined>();

  const params = useParams();

  const { data } = useGetProduct(params?.id as string);

  useEffect(() => {
    if (data?.id) {
      setProduct(data);
    }
  }, [data]);

  return (
    <ContainerStyled>
      {product !== undefined && <AddEdit data={product} />}
    </ContainerStyled>
  );
};

export default Page;
