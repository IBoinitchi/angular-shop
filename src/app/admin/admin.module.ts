import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AdminLayoutComponent } from "./shared/admin-layout/admin-layout.component";
import { OrderListComponent } from "./order/order-list/order-list.component";
import { ProductListComponent } from "./product/product-list/product-list.component";
import { ProductFormComponent } from "./product/product-form/product-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthGuard } from "../shared/guards/auth.guard";
import { QuillModule } from "ngx-quill";
import { SearchPipe } from "../shared/pipes/search.pipe";
import { AuthDirective } from "../shared/directives/auth.directive";
import { UserListComponent } from "./user/user-list/user-list.component";
import { UserFormComponent } from "./user/user-form/user-form.component";
import { RoleTypeEnum } from "../shared/models/roleTypeEnum";
import { RoleGuard } from "../shared/guards/role.guard";

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
            component: UserListComponent,
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
            component: ProductListComponent,
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
            component: OrderListComponent,
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
    ProductListComponent,
    ProductFormComponent,
    OrderListComponent,
    UserListComponent,
    UserFormComponent,
  ],
})
export class AdminModule {}
