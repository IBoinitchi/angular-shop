import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../shared/interfaces';
import { ProductService } from '../shared/product.service';

@Component({
	selector: 'app-product',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.scss']
})
export class ProductComponent {

	@Input() product: Product

	constructor(private productService: ProductService) {}

	addProduct(product: Product) {
		this.productService.addProductToOrder(product);
	}
}
