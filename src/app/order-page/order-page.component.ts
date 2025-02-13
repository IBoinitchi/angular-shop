import { Component, OnInit } from "@angular/core";
import { ProductService } from "../shared/services/product.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { OrderService } from "../shared/services/order.service";
import { Product } from "../shared/models/interfaces";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-order-page",
  templateUrl: "./order-page.component.html",
  styleUrls: ["./order-page.component.scss"],
})
export class OrderPageComponent implements OnInit {
  orderProducts: Product[] = [];
  totalPrice: number = 0;
  isSubmit: Boolean = false;
  added: String = "";
  form = new FormGroup({
    name: new FormControl(null),
    phone: new FormControl(null),
    address: new FormControl(null),
    payment: new FormControl("cash"),
  });

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.orderProducts = this.productService.orderProducts;
    for (let i = 0; i < this.orderProducts.length; i++) {
      this.totalPrice += +this.orderProducts[i].price;
    }

    this.form = this.formBuilder.group({
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ],
      ],
      phone: ["", [Validators.required, Validators.pattern("^[0-9]{9}$")]],
      address: ["", [Validators.required]],
      payment: ["cash", Validators.required],
    });
  }

  get fc() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.isSubmit = true;

    this.orderService
      .create({
        name: this.form.value.name,
        phone: this.form.value.phone,
        address: this.form.value.address,
        payment: this.form.value.payment,
        products: this.orderProducts,
        price: this.totalPrice,
        date: new Date().toDateString(),
      })
      .subscribe({
        next: () => {
          this.form.reset();
          this.added = "Delivery is framed";
          this.isSubmit = false;
        },
      });
  }

  deleteOrder(product: Product) {
    this.totalPrice -= +product.price;
    this.orderProducts.splice(this.orderProducts.indexOf(product), 1);
  }
}
