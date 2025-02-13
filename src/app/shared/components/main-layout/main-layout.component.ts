import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ProductTypeEnum } from "../../models/productTypeEnum";

@Component({
  selector: "app-main-layout",
  templateUrl: "./main-layout.component.html",
  styleUrls: ["./main-layout.component.scss"],
})
export class MainLayoutComponent {
  constructor(private router: Router) {}

  setProductPage(productType = "") {
    if (productType.toLocaleUpperCase()! in ProductTypeEnum) {
      this.router.navigate(["/products", productType]);
    }
  }
}
