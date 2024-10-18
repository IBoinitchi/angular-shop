import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared/product.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { OrderService } from '../shared/order.service';
import { Product } from '../shared/interfaces';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss']
})
export class OrderPageComponent implements OnInit {

  orderProducts = [];
  totalPrice = 0;
  form: UntypedFormGroup;
  isSubmit: Boolean = false;
  added: String = '';

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.orderProducts = this.productService.orderProducts;
    for(let i = 0; i < this.orderProducts.length; i++) {
      this.totalPrice += +this.orderProducts[i].price;
    }

    this.form = new UntypedFormGroup({
      name: new UntypedFormControl(null, Validators.required),
      phone: new UntypedFormControl(null, Validators.required),
      address: new UntypedFormControl(null, Validators.required),
      payment: new UntypedFormControl('cash'),
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.isSubmit = true;

    const order = {
      name: this.form.value.name,
      phone: this.form.value.phone,
      address: this.form.value.address,
      payment: this.form.value.payment,
      orders: this.orderProducts,
      price: this.totalPrice,
      date: new Date()
    };

    this.orderService.createOrder(order).subscribe( res => {
      this.form.reset();
      this.added = 'Delivery is framed';
      this.isSubmit = false;
    });
  }

  deleteOrder(product: Product) {
    this.totalPrice -= + product.price;
    this.orderProducts.splice(this.orderProducts.indexOf(product), 1);
  }
}
