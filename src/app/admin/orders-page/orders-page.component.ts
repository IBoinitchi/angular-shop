import { Component, OnInit } from "@angular/core";
import { Order } from "src/app/shared/interfaces";
import { OrderService } from "src/app/shared/order.service";

@Component({
  selector: "app-orders-page",
  templateUrl: "./orders-page.component.html",
  styleUrls: ["./orders-page.component.scss"],
})
export class OrdersPageComponent implements OnInit {
  orders: Order[] = [];
  orderName: string = "";

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getAllOrders().subscribe((orders) => {
      this.orders = orders;
    });
  }

  delete(orderId) {
    this.orderService.deleteOrder(orderId).subscribe(() => {
      this.orders = this.orders.filter((order) => order.id !== orderId);
    });
  }
}
