import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';

@Component({
	selector: 'app-main-layout',
	templateUrl: './main-layout.component.html',
	styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {

	type = 'Phone';

	constructor(
		private router: Router,
		private productService: ProductService
	) {}

	setType(type = '') {
		this.type = type;

		if (this.type !== 'Order') {
			this.router.navigate(['/'], {
				queryParams: {
					type: this.type
				}
			});

			this.productService.setType(this.type);
		}
	}
}
