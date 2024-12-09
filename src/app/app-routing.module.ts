import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainLayoutComponent } from "./shared/main-layout/main-layout.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { ProductPageComponent } from "./product-page/product-page.component";
import { OrderPageComponent } from "./order-page/order-page.component";
import { LoginPageComponent } from "./admin/login-page/login-page.component";
import { AdminLayoutComponent } from "./admin/shared/admin-layout/admin-layout.component";

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
        component: ProductPageComponent,
      },
      {
        path: "order",
        component: OrderPageComponent,
      },
      {
        path: "order",
        component: OrderPageComponent,
      },
    ],
  },
  {
    path: "login",
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        component: LoginPageComponent,
      },
    ],
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
export class AppRoutingModule {}
