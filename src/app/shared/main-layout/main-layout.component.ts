import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ProductService } from "../product.service";
import { ProductTypeEnum } from "../productTypeEnum";

@Component({
  selector: "app-main-layout",
  templateUrl: "./main-layout.component.html",
  styleUrls: ["./main-layout.component.scss"],
})
export class MainLayoutComponent {
  constructor(private router: Router, private productService: ProductService) {}

  setProductPage(productType = "") {
    if (productType! in ProductTypeEnum) {
      this.router.navigate(["/products", productType]);
      this.productService.productType = productType;
    }
  }
}
