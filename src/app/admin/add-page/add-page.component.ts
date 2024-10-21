import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/shared/product.service';

@Component({
	selector: 'app-add-page',
	templateUrl: './add-page.component.html',
	styleUrls: ['./add-page.component.scss']
})
export class AddPageComponent implements OnInit {

	form: UntypedFormGroup;
	isSubmit: Boolean = false;

	constructor(
		private productService: ProductService,
		private router: Router
	) {}

	ngOnInit() {
		this.form = new UntypedFormGroup({
			type: new UntypedFormControl(null, Validators.required),
			title: new UntypedFormControl(null, Validators.required),
			photo: new UntypedFormControl(null, Validators.required),
			info: new UntypedFormControl(null, Validators.required),
			price: new UntypedFormControl(null, Validators.required),
		});
	}

	submit() {
		if (this.form.invalid) {
			return;
		}

		this.isSubmit = true;

		this.productService.createProduct({
			type: this.form.value.type,
			title: this.form.value.title,
			photo: this.form.value.photo,
			info: this.form.value.info,
			price: this.form.value.price,
			date: new Date()
		}).subscribe(res => {
			this.form.reset();
			this.isSubmit = false;
			this.router.navigate(['/admin', 'dashboard']);
		});
	}

}
