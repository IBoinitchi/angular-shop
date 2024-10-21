import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared/product.service';
import { Product } from '../shared/interfaces';

@Component({
	selector: 'app-main-page',
	templateUrl: './main-page.component.html',
	styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

	products;
	productType: String = '';

	constructor(
		private productService: ProductService
	) {}

	ngOnInit() {
		this.products = this.productService.getAllProducts();
	}

	getType() {
		return this.productService.type;
	}
}
