import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
	selector: 'app-admin-layout',
	templateUrl: './admin-layout.component.html',
	styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {

	constructor(
		private authService: AuthService,
		private router: Router
	) {}

	logout($event) {
		$event.preventDefault();
		this.authService.logout();
		this.router.navigate(['/admin', 'login']);
	}

	isAuthorized () {
		return this.authService.isAuth();
	}
}
