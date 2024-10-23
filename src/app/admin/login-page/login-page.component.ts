import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
	selector: 'app-login-page',
	templateUrl: './login-page.component.html',
	styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
	form: UntypedFormGroup;
	submitted = false;

	constructor(
		private authService: AuthService,
		private router: Router
	) {}

	ngOnInit() {
		this.form = new UntypedFormGroup({
			email: new UntypedFormControl(null, [Validators.required, Validators.email]),
			password: new UntypedFormControl(null, [Validators.required, Validators.minLength(6)])
		})
	}

	submit() {
		if (this.form.invalid) {
			return;
		}

		this.submitted = true;

		this.authService
			.login({
				email: this.form.value.email,
				password: this.form.value.password,
				returnSecureToken: true
			}).subscribe(res => {
				this.form.reset();
				this.router.navigate(['/admin', 'dashboard']);
			}, () => {
				this.submitted = false;
			});
	}

}
