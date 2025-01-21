import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { ProductTypeEnum } from "../models/productTypeEnum";
import { Product } from "../models/interfaces";
import { CrudService } from "./crud.service";

@Injectable({
  providedIn: "root",
})
export class ProductService extends CrudService {
  tableName = "products";
  orderProducts: Product[] = [];

  getProductsByType(productType: string | null) {
    productType = productType || ProductTypeEnum.PHONE;

    return this.getAllData().pipe(
      map((products) => {
        return products.filter((product) => {
          return product.type === ProductTypeEnum[productType.toUpperCase()];
        });
      })
    );
  }

  addProductToOrder(product: Product) {
    this.orderProducts.push(product);
  }
}
