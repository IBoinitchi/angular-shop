import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { FbResponse } from './interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  createOrder(order) {
    return this.http.post(`${environment.fbDbUrl}/orders.json`, order)
      .pipe(
        map((res: FbResponse) => {
          return {
            ...order,
            id: res.name,
            date: new Date(order.date)
          };
        })
      );
  }

  // getAllProducts() {
  //   return this.http.get(`${environment.fbDbUrl}/products.json`)
  //     .pipe(
  //       map(response => {
  //         return Object.keys(response)
  //           .map(key => ({
  //             ...response[key],
  //             id: key,
  //             date: new Date(response[key].date)
  //           }));
  //       })
  //     );
  // }

  // deleteProduct(productId) {
  //   return this.http.delete(`${environment.fbDbUrl}/products/${productId}.json`);
  // }
}
