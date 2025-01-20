import { Component, OnInit } from "@angular/core";
import { Product } from "src/app/shared/models/interfaces";
import { ProductService } from "src/app/shared/services/product.service";

@Component({
  selector: "app-products-page",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  productName: string = "";

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.productType = "ALL";
    this.productService.getAllProducts().subscribe((products) => {
      this.products = products;
    });
  }

  delete(productId: string) {
    this.productService.deleteProduct(productId).subscribe(() => {
      this.products = this.products.filter(
        (product) => product.id !== productId
      );
    });
  }
}
