import { RoleTypeEnum } from "./roleTypeEnum";

export interface DisplayUser {
  name?: string;
  email?: string;
  role?: RoleTypeEnum;
  canBeDeleted?: boolean;
  id?: string;
  password?: string;
}

export interface AuthenticateUser extends DisplayUser {
  token?: string;
  tokenExp?: string;
  lastSignInTime?: string;
}

export interface Product {
  id?: string;
  type?: string;
  title?: string;
  photo?: string;
  info?: string;
  price?: string;
  date?: Date;
}

export interface Order {
  id?: string;
  name?: string;
  phone?: string;
  payment?: string;
  address?: string;
  price?: number;
  products: Product[];
  date?: string;
}
