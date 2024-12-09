import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import { FirebaseResponse, Product } from "./interfaces";
import { ProductTypeEnum } from "./productTypeEnum";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  productType = "phone";
  orderProducts: Product[] = [];

  constructor(private http: HttpClient) {}

  createProduct(newProduct: Product): Observable<Product> {
    return this.http
      .post<FirebaseResponse>(
        `${environment.firebaseDBUrl}/products.json`,
        newProduct
      )
      .pipe(
        map((response: FirebaseResponse) => {
          return {
            ...newProduct,
            id: response?.name,
            date: new Date(newProduct.date),
          };
        })
      );
  }

  getAllProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(`${environment.firebaseDBUrl}/products.json`)
      .pipe(
        map((products) => {
          return Object.keys(products)
            .map((productId) => ({
              ...products[productId],
              id: productId,
              date: new Date(products[productId].date),
            }))
            .filter((product) => {
              if (this.productType === "ALL") {
                return Object.keys(ProductTypeEnum)
                  .map((productType) => ProductTypeEnum[productType])
                  .includes(product.type);
              }

              return product.type === ProductTypeEnum[this.productType];
            });
        })
      );
  }

  getProduct(productId: string): Observable<Product> {
    return this.http
      .get<Product>(`${environment.firebaseDBUrl}/products/${productId}.json`)
      .pipe(
        map((product: Product) => {
          return {
            ...product,
            id: productId,
            date: new Date(product.date),
          };
        })
      );
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(
      `${environment.firebaseDBUrl}/products/${productId}.json`
    );
  }

  updateProduct(product: Product): Observable<any> {
    return this.http.patch(
      `${environment.firebaseDBUrl}/products/${product.id}.json`,
      product
    );
  }

  addProductToOrder(product: Product) {
    this.orderProducts.push(product);
  }
}
