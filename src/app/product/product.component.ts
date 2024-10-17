import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../shared/interfaces';
import { ProductService } from '../shared/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  @Input() product

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {
  }

  addProduct(product: Product) {
    this.productService.addProductToOrder(product);
  }
}
