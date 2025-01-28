import { Injectable } from "@angular/core";
import { ProductTypeEnum } from "../models/productTypeEnum";
import { Product } from "../models/interfaces";
import { CrudService } from "./crud.service";
import { Observable } from "rxjs";
import { equalTo, onValue, orderByChild, query } from "@angular/fire/database";

@Injectable({
  providedIn: "root",
})
export class ProductService<T = any> extends CrudService {
  tableName = "products";
  orderProducts: Product[] = [];

  getProductsByType(productType: string | null): Observable<T[]> {
    productType = productType || ProductTypeEnum.PHONE;
    const productQuery = query(
      this.createRef(this.tableName),
      orderByChild("type"),
      equalTo(productType)
    );

    return new Observable((observer) => {
      onValue(productQuery, (snapshot) => {
        const oldData = snapshot.val();
        const newData = Object.keys(oldData).map((key) => ({
          ...oldData[key],
          id: key,
        })) as T[];
        return observer.next(newData);
      });
    });
  }

  addProductToOrder(product: Product) {
    this.orderProducts.push(product);
  }
}
