import Button from "@/app/components/button/Button";
import FormInput from "@/app/components/form/FormInput";
import { API_ROUTES, PAGE_ROUTES } from "@/app/configs/route.config";
import { commonTheme } from "@/app/configs/theme.config";
import {
  useAddProduct,
  useEditProduct,
  useGetCategories,
  useGetSubcategories,
} from "@/app/hooks/api";
import { useToast } from "@/app/hooks/useToast";
import { ProductType } from "@/app/types";
import { CategoryType } from "@/app/types/category.type";
import { SubcategoryType } from "@/app/types/subcategory.type";
import {
  SectionContainerStyled,
  SectionTitleStyled,
} from "@/styles/common.styles";
import { FileImageOutlined, UploadOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Avatar, Box, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { number, object, string } from "yup";
import { DEFAULT_PAGINATION } from "@/app/constants/pagination.constant";
import FormAutocomplete from "@/app/components/form/FormAutocomplete";

interface AddEditProps {
  data?: ProductType;
}

const AddEdit = (props: AddEditProps) => {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data } = props;

  const { mutate: addProduct } = useAddProduct();
  const { mutate: editProduct } = useEditProduct();

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryType[]>([]);

  const { data: categoryResponse } = useGetCategories({
    limit: DEFAULT_PAGINATION.pageUnlimitedSize,
    page: 1,
  });

  const { data: subcategoryResponse } = useGetSubcategories({
    limit: DEFAULT_PAGINATION.pageUnlimitedSize,
    page: 1,
  });

  useEffect(() => {
    setCategories((categoryResponse?.data as CategoryType[]) || []);
    setSubcategories((subcategoryResponse?.data as SubcategoryType[]) || []);
  }, [categoryResponse?.data, subcategoryResponse?.data]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: data
      ? {
          name: data.name,
          price: data.price,
          categoryId: data.categoryId,
          subcategoryId: data.subcategoryId,
        }
      : {
          name: "",
          price: 0,
          categoryId: "",
          subcategoryId: "",
        },
    mode: "onChange",
    resolver: yupResolver(
      object().shape({
        name: string().required("Name is required"),
        price: number()
          .transform((value, originalValue) =>
            originalValue === "" ? undefined : value
          )
          .typeError("Price must be a number")
          .required("Price of the product is required"),
        categoryId: string().optional(),
        subcategoryId: string().optional(),
      })
    ),
  });

  const selectedCategoryId = watch("categoryId") ?? "";

  const filteredSubcategories = subcategories.filter(
    (item) => item.category.id === selectedCategoryId
  );

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Reset subcategoryId khi categoryId thay đổi
    setValue("subcategoryId", "");
    setInputValue("");
  }, [selectedCategoryId]);

  const onSubmit = async (payload: Record<string, any>) => {
    console.log(payload);
    if (data) {
      editProduct(
        { ...payload, id: data.id },
        {
          onSuccess: async (res) => {
            await queryClient.invalidateQueries(
              `${API_ROUTES.PRODUCT.INDEX}/${data.id}`
            );

            if (res?.id) {
              toast.success("Successfully updated product");

              router.replace(PAGE_ROUTES.ADMIN.PRODUCT.INDEX);
            }
          },
          onError: async (err) => {
            toast.error("Error while updating product");
          },
        }
      );
    } else {
      addProduct(payload, {
        onSuccess: async (res) => {
          await queryClient.invalidateQueries(API_ROUTES.PRODUCT.INDEX);

          if (res?.id) {
            toast.success(
              `Successfully created a new product: ${payload.name}`
            );

            router.replace(PAGE_ROUTES.ADMIN.PRODUCT.INDEX);
          }
        },
        onError: async (err) => {
          toast.error("Error while creating product");
        },
      });
    }
  };
  return (
    <>
      <Box
        component={"form"}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        onInvalid={console.log}
      >
        <Grid container columnSpacing={commonTheme.space?.form?.horizontal}>
          <Grid size={7}>
            <SectionContainerStyled>
              <Box
                sx={{
                  borderBottom: "1px solid #c7c7c7",
                  width: "100%",
                }}
              >
                <SectionTitleStyled>Information</SectionTitleStyled>
              </Box>
              <Box sx={{ width: "100%" }}>
                <Grid
                  container
                  columnSpacing={commonTheme.space?.form?.horizontal}
                >
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormInput
                          error={errors.name}
                          label={"Name of product *"}
                          type="text"
                          value={value}
                          onChange={onChange}
                          placeholder="Enter name of product"
                          sx={{ marginTop: "24px" }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="price"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormInput
                          error={errors.price}
                          label={"Price ($)"}
                          type="number"
                          value={value ? value.toString() : ""}
                          onChange={onChange}
                          placeholder="Enter price"
                          sx={{ marginTop: "24px" }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            </SectionContainerStyled>
            <SectionContainerStyled>
              <Box
                sx={{
                  borderBottom: "1px solid #c7c7c7",
                  width: "100%",
                }}
              >
                <SectionTitleStyled>Type of Product</SectionTitleStyled>
              </Box>
              <Box sx={{ width: "100%" }}>
                <Grid
                  container
                  columnSpacing={commonTheme.space?.form?.horizontal}
                >
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="categoryId"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <FormAutocomplete
                          error={errors.categoryId}
                          label="Category"
                          getOptionLabel={(option) => option.name}
                          onChange={(value: any) => {
                            onChange(value?.id);
                          }}
                          options={categories}
                          placeholder="Select Category"
                          value={
                            categories.find((option) => option.id === value) ||
                            null
                          }
                          sx={{ marginTop: "24px" }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  columnSpacing={commonTheme.space?.form?.horizontal}
                >
                  {selectedCategoryId && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name="subcategoryId"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <FormAutocomplete
                            error={errors.subcategoryId}
                            label="Subcategory"
                            getOptionLabel={(option) => option.name}
                            onChange={(value: any) => {
                              onChange(value?.id);
                            }}
                            onInputChange={(e: any, val: any) =>
                              setInputValue(val)
                            }
                            inputValue={inputValue}
                            options={filteredSubcategories}
                            placeholder="Select Subcategory"
                            value={
                              subcategories.find(
                                (option) => option.id === value
                              ) ?? null
                            }
                            sx={{ marginTop: "24px" }}
                          />
                        )}
                      />
                    </Grid>
                  )}
                </Grid>
              </Box>
            </SectionContainerStyled>
            <Grid container size={{ xs: 12, sm: 1 }}>
              <Button
                size="small"
                sx={{ width: "100%" }}
                title="Submit"
                type="submit"
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AddEdit;
