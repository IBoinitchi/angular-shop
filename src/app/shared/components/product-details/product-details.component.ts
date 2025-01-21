import { Component, OnInit } from "@angular/core";
import { ProductService } from "../../services/product.service";
import { ActivatedRoute } from "@angular/router";
import { Product } from "../../models/interfaces";
import { Observable } from "rxjs";

@Component({
  selector: "app-product-page",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.scss"],
})
export class ProductDetailsComponent implements OnInit {
  product: Observable<Product> = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.product = this.productService.getOneById(
      this.route.snapshot.params["id"]
    );
  }

  addProduct(product: Product) {
    this.productService.addProductToOrder(product);
  }
}
