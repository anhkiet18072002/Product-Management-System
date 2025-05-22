import { CategoryType } from "./category.type";
import { BaseEntityType } from "./common.type";

export type SubcategoryType = BaseEntityType & {
  name: string;
  description?: string;
  category: CategoryType;
};
