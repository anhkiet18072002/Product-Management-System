import { UserType } from "./user.type";

export type LoginResponseType = {
  user: UserType;
  token: {
    access: string;
    expiration: number;
  };
};
