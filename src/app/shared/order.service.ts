import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { FirebaseResponse, Order } from './interfaces';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class OrderService {

	constructor(private http: HttpClient) {}

	createOrder(newOrder: Order): Observable<Order> {
		return this.http.post<FirebaseResponse>(`${environment.firebaseDBUrl}/orders.json`, newOrder)
			.pipe(
				map((response: FirebaseResponse) => {
					return {
						...newOrder,
						id: response.name,
						date: new Date(newOrder.date)
					};
				})
			);
	}

	getAllOrders(): Observable<Order[]> {
		return this.http.get<Order[]>(`${environment.firebaseDBUrl}/orders.json`)
			.pipe(
				map(orders => {
					return Object.keys(orders)
						.map(orderId => ({
							...orders[orderId],
							id: orderId,
							date: new Date(orders[orderId].date)
						}));
				})
			);
	}

	deleteOrder(orderId: string): Observable<any> {
		return this.http.delete(`${environment.firebaseDBUrl}/orders/${orderId}.json`);
	}
}
