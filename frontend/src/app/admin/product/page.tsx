"use client";

import Button from "@/app/components/button/Button";
import DataGrid from "@/app/components/datagrid/DataGrid";
import DeleteConfirmationDialog from "@/app/components/dialog/DeleteConfirmationDialog";
import SearchTextField from "@/app/components/input/SearchTextField";
import { API_ROUTES, PAGE_ROUTES } from "@/app/configs/route.config";
import { commonTheme } from "@/app/configs/theme.config";
import { DEFAULT_PAGINATION } from "@/app/constants/pagination.constant";
import {
  productClient,
  useDeleteProduct,
  useGetProducts,
  useLikeProduct,
} from "@/app/hooks/api";
import { useAccessToken } from "@/app/hooks/useAccessToken";
import { ProductType } from "@/app/types";

import { ContainerStyled } from "@/styles/common.styles";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Box, Grid, Tooltip, Typography } from "@mui/material";
import {
  GridActionsCellItem,
  GridCellParams,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
} from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import { jwtDecode } from "jwt-decode";
import { userClient } from "@/app/hooks/api/user.api";
import { NextResponse } from "next/server";
import { product_likeClient } from "@/app/hooks/api/product_like.api";
import useLoading from "@/app/hooks/useLoading";

interface DecodedToken {
  email?: string;
}

type ProductWithLike = ProductType & { numberOfLike: number; liked: boolean };

const Page = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setLoading } = useLoading();

  const [products, setProducts] = useState<ProductWithLike[]>([]);
  const [isDeleting, setIsDeleting] = useState<ProductType | undefined>();

  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: likeProduct } = useLikeProduct();

  const accessToken = useAccessToken();
  const [isAdmin, setIsAdmin] = useState(false);
  const [idUser, setIdUser] = useState<string>("");

  const handleEdit = (product: ProductType) => {
    router.push(`${PAGE_ROUTES.ADMIN.PRODUCT.EDIT}/${product.id}`);
  };

  const handleDelete = (product: ProductType) => {
    setIsDeleting(product);
  };

  const handlePaginate = (model: GridPaginationModel) => {
    setPaginationModel(model);
  };

  const handleConfirmDelete = () => {
    if (isDeleting) {
      deleteProduct(isDeleting?.id, {
        onSuccess: async (res) => {
          await queryClient.invalidateQueries(API_ROUTES.PRODUCT.INDEX);

          // Hide confirmation modal
          setIsDeleting(undefined);
        },
        onError: async (err) => {
          setIsDeleting(undefined);

          // Show toast
        },
      });
    }
  };

  const [paginationModel, setPaginationModel] =
    useState<GridPaginationModel>(DEFAULT_PAGINATION);

  const [filters, setFilters] = useState({});

  const { data } = useGetProducts({
    ...filters,
    limit: paginationModel.pageSize,
    page: paginationModel.page + 1,
  });

  useEffect(() => {
    // setProducts((data?.data as ProductType[]) || []);
    const fetchLikes = async () => {
      if (!data?.data) return;
      setLoading(true);

      const productList = data.data as ProductType[];
      const updatedProducts: ProductWithLike[] = await Promise.all(
        productList.map(async (product) => {
          try {
            const numberOfLike = await productClient.numberOfLike(product.id);
            let liked = false;
            if (idUser) {
              const res = await product_likeClient.check_like({
                userId: idUser,
                productId: product.id,
              });

              liked = res.status;
            }
            return {
              ...product,
              numberOfLike: numberOfLike as unknown as number,
              liked,
            };
          } catch (err) {
            return {
              ...product,
              numberOfLike: 0,
              liked: false,
            };
          }
        })
      );

      setProducts(updatedProducts);
      setLoading(false);
    };

    fetchLikes();
  }, [data, idUser]);

  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        try {
          const decoded = jwtDecode<DecodedToken>(accessToken);
          if (decoded.email) {
            if (decoded.email === "admin@example.com") {
              setIsAdmin(true);
            }
            try {
              const user = await userClient.findByEmail(decoded.email);
              if (user) {
                setIdUser(user.id);
              }
            } catch (err) {
              console.log("Error", err);
            }

            // xử lý gì đó với user nếu cần
          }
        } catch (err) {
          console.error("Error decoding token or fetching user:", err);
        }
      }
    };

    fetchUser();
  }, [accessToken]);

  const handleLiked = (row: ProductWithLike) => {
    if (!accessToken) {
      router.push(PAGE_ROUTES.LOGIN);
      return;
    }
    setProducts((prev) =>
      prev.map((p) =>
        p.id === row.id
          ? {
              ...p,
              numberOfLike: p.liked
                ? Math.max(0, (p.numberOfLike || 0) - 1)
                : (p.numberOfLike || 0) + 1,
              liked: !p.liked,
            }
          : p
      )
    );
    if (idUser && row.id) {
      //call api product/:id/like
      likeProduct({ userId: idUser, productId: row.id, id: row.id });
    }
  };

  const columns: GridColDef<ProductWithLike>[] = useMemo(() => {
    const baseColumns: GridColDef<ProductWithLike>[] = [
      {
        field: "name",
        flex: 0.2,
        headerName: "Name",
        renderCell: (params: GridCellParams<ProductWithLike>) => {
          const { row } = params;
          return (
            <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
              <Typography sx={{ fontSize: "14px" }}>{row?.name}</Typography>
            </Box>
          );
        },
      },
      {
        field: "price",
        flex: 0.1,
        headerName: "Price",
        renderCell: (params: GridCellParams<ProductWithLike>) => {
          const { row } = params;
          return (
            <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
              <Typography
                sx={{ fontSize: "14px" }}
              >{`${row.price} $`}</Typography>
            </Box>
          );
        },
      },
      {
        field: "category",
        flex: 0.3,
        headerName: "Category",
        renderCell: (params: GridCellParams<ProductWithLike>) => {
          const { row } = params;
          return (
            <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
              <Typography sx={{ fontSize: "14px" }}>
                {row.category?.name}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "subcategory",
        flex: 0.3,
        headerName: "Subcategory",
        renderCell: (params: GridCellParams<ProductWithLike>) => {
          const { row } = params;
          return (
            <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
              <Typography sx={{ fontSize: "14px" }}>
                {row.subcategory?.name}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "numberOfLike",
        flex: 0.2,
        headerName: "Number of like",
        renderCell: (params: GridCellParams<ProductWithLike>) => {
          const { row } = params;

          return (
            <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
              <Typography sx={{ fontSize: "14px" }}>
                {row.numberOfLike}
              </Typography>
            </Box>
          );
        },
      },
    ];

    // 👇 Thêm cột actions nếu là admin
    if (isAdmin) {
      baseColumns.push({
        field: "actions",
        minWidth: 100,
        maxWidth: 100,
        headerName: "",
        type: "actions",
        getActions: (params: GridRowParams<ProductWithLike>) => {
          const { row } = params;

          return [
            <Tooltip key={"edit"} title={"Edit"}>
              <GridActionsCellItem
                icon={<EditOutlined style={{ color: "#1890ff" }} />}
                onClick={() => handleEdit(row)}
                label="Edit"
              />
            </Tooltip>,
            <Tooltip key={"delete"} title={"Delete"}>
              <GridActionsCellItem
                icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
                onClick={() => handleDelete(row)}
                label="Delete"
              />
            </Tooltip>,
          ];
        },
      });
    } else {
      baseColumns.push({
        field: "like",
        headerName: "",
        minWidth: 100,
        maxWidth: 100,
        renderCell: (params: GridCellParams<ProductWithLike>) => {
          const { row } = params;
          return (
            <Button
              size="small"
              title={row.liked ? "Unlike" : "Like"}
              onClick={() => handleLiked(row)}
            />
          );
        },
      });
    }

    return baseColumns;
  }, [isAdmin, handleEdit, handleDelete]);

  return (
    <ContainerStyled>
      {/* Filters */}
      <Grid
        container
        justifyContent={"flex-end"}
        columnSpacing={commonTheme.space?.form?.horizontal}
      >
        <Grid
          size={3}
          sx={{ display: "flex", alignItems: "center" }}
          columnGap={commonTheme.space?.form?.horizontal}
        >
          <SearchTextField
            placeholder="Search by name"
            onChange={(value: string | undefined) => {
              if (value && value?.length >= 2) {
                setFilters((preValue: any) => {
                  return {
                    ...preValue,
                    search: value,
                  };
                });
              } else if (value?.length === 0) {
                setFilters((preValue: any) => {
                  return {
                    ...preValue,
                    search: "",
                  };
                });
              }
            }}
          />
          <Button
            onClick={() => {
              router.push(PAGE_ROUTES.ADMIN.PRODUCT.ADD);
            }}
            startIcon={<PlusOutlined />}
            size="small"
            title="Add"
          />
        </Grid>
      </Grid>

      {/* Skill list */}

      <Box sx={{ marginTop: "20px" }}>
        <DataGrid
          columns={columns}
          rows={products}
          rowHeight={64}
          rowCount={data?.meta?.total || 0}
          paginationModel={{
            page: data?.meta?.page ? data?.meta?.page - 1 : 0,
            pageSize: data?.meta?.pageSize || 10,
          }}
          onPaginationModelChange={handlePaginate}
        />
      </Box>

      {/* Is deleting skill */}
      {
        <DeleteConfirmationDialog
          title={"Are you sure you want to delete?"}
          description={`By deleting ${isDeleting?.name}, all associated data will also be deleted.`}
          open={isDeleting !== undefined}
          onCancel={() => setIsDeleting(undefined)}
          onConfirm={handleConfirmDelete}
        />
      }
    </ContainerStyled>
  );
};

export default Page;
