import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Order } from "src/app/shared/models/interfaces";
import { OrderService } from "src/app/shared/services/order.service";

@Component({
  selector: "app-order-list",
  templateUrl: "./order-list.component.html",
  styleUrls: ["./order-list.component.scss"],
})
export class OrderListComponent implements OnInit {
  orders$: Observable<Order[]> = null;
  orderName: string = "";

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orders$ = this.orderService.getAllData();
  }

  delete(orderId: string) {
    this.orderService.delete(orderId).subscribe({
      next: () => {
        this.orders$ = this.orders$.pipe(
          map((orders: Order[]) =>
            orders.filter((order) => order.id !== orderId)
          )
        );
      },
    });
  }
}
