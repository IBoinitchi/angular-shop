import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AdminLayoutComponent } from "./shared/admin-layout/admin-layout.component";
import { OrdersPageComponent } from "./orders-page/orders-page.component";
import { ProductsPageComponent } from "./products/product-list/product-list.component";
import { ProductFormComponent } from "./products/product-form/product-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthGuard } from "../shared/auth.guard";
import { QuillModule } from "ngx-quill";
import { SearchPipe } from "../shared/search.pipe";
import { AuthDirective } from "../shared/auth.directive";
import { UsersPageComponent } from "./users/user-list/user-list.component";
import { UserFormComponent } from "./users/user-form/user-form.component";
import { RoleTypeEnum } from "../shared/roleTypeEnum";
import { RoleGuard } from "../shared/role.guard";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    RouterModule.forChild([
      {
        path: "",
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: "",
            redirectTo: "users",
            pathMatch: "full",
          },
          {
            path: "users",
            component: UsersPageComponent,
            canActivate: [RoleGuard],
            data: {
              roles: [RoleTypeEnum.ADMIN, RoleTypeEnum.SUPER_ADMIN],
            },
          },
          {
            path: "users/add",
            component: UserFormComponent,
            canActivate: [RoleGuard],
            data: {
              roles: [RoleTypeEnum.SUPER_ADMIN],
            },
          },
          {
            path: "users/edit/:id",
            component: UserFormComponent,
            canActivate: [RoleGuard],
            data: {
              roles: [RoleTypeEnum.SUPER_ADMIN],
            },
          },
          {
            path: "products",
            component: ProductsPageComponent,
          },
          {
            path: "products/add",
            component: ProductFormComponent,
          },
          {
            path: "products/edit/:id",
            component: ProductFormComponent,
          },
          {
            path: "orders",
            component: OrdersPageComponent,
          },
        ],
      },
    ]),
    SearchPipe,
    AuthDirective,
  ],
  exports: [RouterModule],
  declarations: [
    AdminLayoutComponent,
    ProductsPageComponent,
    ProductFormComponent,
    OrdersPageComponent,
    UsersPageComponent,
    UserFormComponent,
  ],
})
export class AdminModule {}
