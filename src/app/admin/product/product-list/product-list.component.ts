import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Product } from "src/app/shared/models/interfaces";
import { ProductService } from "src/app/shared/services/product.service";

@Component({
  selector: "app-products-page",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]> = null;
  productName: string = "";

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.products$ = this.productService.getAllData();
  }

  delete(productId: string) {
    this.productService.delete(productId).subscribe({
      next: () => {
        this.products$ = this.products$.pipe(
          map((products: Product[]) =>
            products.filter((product) => product.id !== productId)
          )
        );
      },
    });
  }
}
