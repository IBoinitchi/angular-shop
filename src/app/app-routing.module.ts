import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './shared/main-layout/main-layout.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { OrderPageComponent } from './order-page/order-page.component';


const routes: Routes = [
	{
		path: '',
		component: MainLayoutComponent,
		children: [
			{
				path: '',
				redirectTo: '/',
				pathMatch: 'full'
			},
			{
				path: '',
				component: MainPageComponent,
			},
			{
				path: 'product/:id',
				component: ProductPageComponent
			},
			{
				path: 'order',
				component: OrderPageComponent
			},
		]
	},
	{
		path: 'admin',
		loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
	},
	{
		path: '**',
		redirectTo: '/',
		pathMatch: 'full'
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {})],
	exports: [RouterModule]
})
export class AppRoutingModule { }
