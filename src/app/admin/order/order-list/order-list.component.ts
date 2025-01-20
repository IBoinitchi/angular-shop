import { Component, OnInit } from "@angular/core";
import { Order } from "src/app/shared/models/interfaces";
import { OrderService } from "src/app/shared/services/order.service";

@Component({
  selector: "app-order-list",
  templateUrl: "./order-list.component.html",
  styleUrls: ["./order-list.component.scss"],
})
export class OrderListComponent implements OnInit {
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
