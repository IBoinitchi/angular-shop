import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainLayoutComponent } from "./shared/components/main-layout/main-layout.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { ProductDetailsComponent } from "./shared/components/product-details/product-details.component";
import { OrderPageComponent } from "./order-page/order-page.component";
import { LoginPageComponent } from "./login-page/login-page.component";

const routes: Routes = [
  {
    path: "",
    component: MainLayoutComponent,
    children: [
      {
        path: "",
        component: MainPageComponent,
      },
      {
        path: "products/:productType",
        component: MainPageComponent,
      },
      {
        path: "product/:id",
        component: ProductDetailsComponent,
      },
      {
        path: "order",
        component: OrderPageComponent,
      },
    ],
  },
  {
    path: "login",
    component: LoginPageComponent,
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./admin/admin.module").then((m) => m.AdminModule),
  },
  {
    path: "**",
    redirectTo: "/",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutes {}
