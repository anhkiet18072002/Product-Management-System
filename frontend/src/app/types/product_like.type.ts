import { CategoryType } from "./category.type";
import { BaseEntityType } from "./common.type";
import { ProductType } from "./product.type";
import { SubcategoryType } from "./subcategory.type";
import { UserType } from "./user.type";

export type Product_LikeType = BaseEntityType & {
  userId: string;
  user: UserType;
  productId: string;
  product: ProductType;
};
