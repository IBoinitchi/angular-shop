import { Injectable } from "@angular/core";
import { CrudService } from "./crud.service";
import { Order } from "../models/interfaces";

@Injectable({
  providedIn: "root",
})
export class OrderService extends CrudService<Order> {
  tableName = "orders";
}
