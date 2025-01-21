import { Injectable } from "@angular/core";
import { CrudService } from "./crud.service";

@Injectable({
  providedIn: "root",
})
export class OrderService extends CrudService {
  tableName = "orders";
}
