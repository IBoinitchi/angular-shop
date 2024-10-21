import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/shared/interfaces';
import { ProductService } from 'src/app/shared/product.service';

@Component({
	selector: 'app-dashboard-page',
	templateUrl: './dashboard-page.component.html',
	styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {

	products: Product[] = [];
	productSubscription: Subscription;
	deleteSubscription: Subscription;
	productName: string = '';

	constructor(private productService: ProductService) {}

	ngOnInit() {
		this.productSubscription = this.productService
			.getAllProducts()
			.subscribe(products => {
				this.products = products;
			});
	}

	delete(productId: string) {
		this.deleteSubscription = this.productService
			.deleteProduct(productId)
			.subscribe(() => {
				this.products = this.products.filter(product => product.id !== productId);
			});
	}

	ngOnDestroy() {
		if (this.productSubscription) {
			this.productSubscription.unsubscribe();
		}

		if (this.deleteSubscription) {
			this.deleteSubscription.unsubscribe();
		}
	}
}
