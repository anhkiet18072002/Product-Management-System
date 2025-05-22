import { BaseEntityType } from "./common.type";

export type CategoryType = BaseEntityType & {
  name: string;
  description?: string;
};
