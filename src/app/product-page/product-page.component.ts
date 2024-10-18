import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared/product.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Product } from '../shared/interfaces';

@Component({
	selector: 'app-product-page',
	templateUrl: './product-page.component.html',
	styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {

	product;

	constructor(
		private productService: ProductService,
		private router: ActivatedRoute
	) { }

	ngOnInit() {
		this.product = this.router.params
			.pipe(
				switchMap(params => {
					return this.productService.getProduct(params.id);
				})
			)
	}

	addProduct(product: Product) {
		this.productService.addProductToOrder(product);
	}
}
