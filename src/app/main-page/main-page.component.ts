import { Component, OnInit } from "@angular/core";
import { ProductService } from "../shared/services/product.service";
import { Product } from "../shared/models/interfaces";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.scss"],
})
export class MainPageComponent implements OnInit {
  products$: Observable<Product[]> = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(({ productType }) => {
      this.products$ = this.productService.getProductsByType(productType);
    });
  }
}
