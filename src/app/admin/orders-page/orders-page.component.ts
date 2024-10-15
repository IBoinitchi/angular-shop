import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { OrderService } from 'src/app/shared/order.service';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss']
})
export class OrdersPageComponent implements OnInit {

  orders = [];
  orderSubscription: Subscription;
  deleteSubscription: Subscription;
  orderName = '';

  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.orderSubscription = this.orderService
      .getAllOrders()
      .subscribe(orders => {
        this.orders = orders;
      });
  }

  delete(orderId) {
    this.deleteSubscription = this.orderService
      .deleteOrder(orderId)
      .subscribe(() => {
        this.orders = this.orders.filter(product => product.id !== orderId);
      });
  }

  ngOnDestroy() {
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }

    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }

}
