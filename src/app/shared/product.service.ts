import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { FbResponse, Product } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  type = 'Phone';
  cartProducts: Product[] = [];

  constructor(private http: HttpClient) { }

  createProduct(product) {
    return this.http.post(`${environment.fbDbUrl}/products.json`, product)
      .pipe(
        map( (res: FbResponse) => {
          return {
            ...product,
            id: res.name,
            date: new Date(product.date)
          };
        })
      );
  }

  getAllProducts() {
    return this.http.get(`${environment.fbDbUrl}/products.json`)
      .pipe(
        map(response => {
          return Object.keys(response)
            .map(key => ({
              ...response[key],
              id: key,
              date: new Date(response[key].date)
            }));
        })
      );
  }

  getProduct(productId) {
    return this.http.get(`${environment.fbDbUrl}/products/${productId}.json`)
      .pipe(
        map((response: Product) => {
          return {
            ...response,
            id: productId,
            date: new Date(response.date)
          };
        })
      );
  }

  deleteProduct(productId) {
    return this.http.delete(`${environment.fbDbUrl}/products/${productId}.json`);
  }

  updateProduct(product: Product) {
    return this.http.patch(`${environment.fbDbUrl}/products/${product.id}.json`, product);
  }

  setType(type) {
    this.type = type;
  }

  addProduct(product: Product) {
    this.cartProducts.push(product);
  }
}
