import { BaseEntityType } from "./common.type";

export type UserType = BaseEntityType & {
  username: string;
  email: string;
  password: string;
};
