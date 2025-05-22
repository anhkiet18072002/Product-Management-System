import { CategoryType } from "./category.type";
import { BaseEntityType } from "./common.type";
import { SubcategoryType } from "./subcategory.type";

export type ProductType = BaseEntityType & {
  name: string;
  price: number;
  categoryId?: string;
  category?: CategoryType;
  subcategoryId?: string;
  subcategory?: SubcategoryType;
};
