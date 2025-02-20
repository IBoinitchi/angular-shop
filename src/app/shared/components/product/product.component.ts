import { Component, Input } from "@angular/core";
import { Product } from "../../models/interfaces";
import { ProductService } from "../../services/product.service";
import { QuillModule } from "ngx-quill";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
  standalone: true,
  imports: [QuillModule, RouterModule],
})
export class ProductComponent {
  @Input() product: Product = <Product>{};

  constructor(private productService: ProductService) {}

  addProduct(product: Product) {
    this.productService.addProductToOrder(product);
  }
}
