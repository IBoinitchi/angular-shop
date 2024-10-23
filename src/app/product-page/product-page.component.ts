import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared/product.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Product } from '../shared/interfaces';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-product-page',
	templateUrl: './product-page.component.html',
	styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {

	product: Observable<Product> = null;

	constructor(
		private productService: ProductService,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		this.product = this.productService.getProduct(this.route.snapshot.params['id']);
	}

	addProduct(product: Product) {
		this.productService.addProductToOrder(product);
	}
}
