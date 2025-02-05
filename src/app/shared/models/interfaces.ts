import { RoleTypeEnum } from "./roleTypeEnum";

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

export interface FirebaseResponse {
  name: string;
}

export interface User {
  name?: string;
  email?: string;
  role?: RoleTypeEnum;
  canBeDeleted?: boolean;
  id?: string;
  password?: string;
}

export interface StorageData {
  accessToken: string;
  expirationTime: string;
  userName: string;
}
