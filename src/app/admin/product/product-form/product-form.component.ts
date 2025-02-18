import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Product } from "src/app/shared/models/interfaces";
import { ProductTypeEnum } from "src/app/shared/models/productTypeEnum";
import { ProductService } from "src/app/shared/services/product.service";

@Component({
  selector: "app-product-form",
  templateUrl: "./product-form.component.html",
  styleUrls: ["./product-form.component.scss"],
})
export class ProductFormComponent implements OnInit {
  form: FormGroup;
  isSubmit = false;
  product = <Product>{};
  productType = ProductTypeEnum;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.product.id = this.route.snapshot.params["id"];

    if (this.product.id) {
      this.loadProduct();
    } else {
      this.initializeForm();
    }
  }

  private loadProduct() {
    this.productService.getOneById(this.product.id).subscribe({
      next: (product: Product) => {
        this.product = { ...this.product, ...product };
        this.initializeForm();
      },
    });
  }

  private initializeForm() {
    this.form = new FormGroup({
      type: new FormControl(this.product?.type || "", Validators.required),
      title: new FormControl(this.product?.title || "", Validators.required),
      photo: new FormControl(this.product?.photo || "", Validators.required),
      info: new FormControl(this.product?.info || "", Validators.required),
      price: new FormControl(this.product?.price || "", Validators.required),
    });
  }

  private finalAction() {
    this.isSubmit = false;
    this.router.navigate(["/admin", "products"]);
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.isSubmit = true;
    const productData: Product = {
      ...this.product,
      ...this.form.value,
      date: new Date().toDateString(),
    };

    if (!!this.product.id) {
      this.productService
        .update(this.product.id, productData)
        .subscribe(() => this.finalAction());
    } else {
      this.productService
        .create(productData)
        .subscribe(() => this.finalAction());
    }
  }
}
