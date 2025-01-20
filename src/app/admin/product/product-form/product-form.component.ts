import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Product } from "src/app/shared/models/interfaces";
import { ProductService } from "src/app/shared/services/product.service";

@Component({
  selector: "app-product-form",
  templateUrl: "./product-form.component.html",
  styleUrls: ["./product-form.component.scss"],
})
export class ProductFormComponent implements OnInit {
  form: FormGroup;
  isSubmit = false;
  isNew = true;
  product: Product = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const productIdKey = this.route.snapshot.params["id"];
    if (productIdKey) {
      this.loadProduct(productIdKey);
    } else {
      this.initializeForm();
    }
  }

  private async loadProduct(productIdKey: string) {
    this.isNew = false;
    try {
      this.product = await this.productService
        .getProduct(productIdKey)
        .toPromise();
      this.initializeForm(this.product);
    } catch (error) {
      console.error("Error load data", error);
    }
  }

  private initializeForm(product?: Product) {
    this.form = new FormGroup({
      type: new FormControl(product?.type || "", Validators.required),
      title: new FormControl(product?.title || "", Validators.required),
      photo: new FormControl(product?.photo || "", Validators.required),
      info: new FormControl(product?.info || "", Validators.required),
      price: new FormControl(product?.price || "", Validators.required),
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.isSubmit = true;
    const productData: Product = {
      ...this.product,
      ...this.form.value,
      date: new Date(),
    };

    if (!this.isNew) {
      this.productService.updateProduct(productData).subscribe(() => {
        this.isSubmit = false;
        this.router.navigate(["/admin", "products"]);
      });
    } else {
      this.productService.createProduct(productData).subscribe(() => {
        this.isSubmit = false;
        this.router.navigate(["/admin", "products"]);
      });
    }
  }
}
