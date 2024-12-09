import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AdminLayoutComponent } from "./shared/admin-layout/admin-layout.component";
import { EditPageComponent } from "./edit-page/edit-page.component";
import { OrdersPageComponent } from "./orders-page/orders-page.component";
import { DashboardPageComponent } from "./dashboard-page/dashboard-page.component";
import { AddPageComponent } from "./add-page/add-page.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthGuard } from "../shared/auth.guard";
import { QuillModule } from "ngx-quill";
import { SearchPipe } from "../shared/search.pipe";

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
            redirectTo: "dashboard",
            pathMatch: "full",
          },
          {
            path: "dashboard",
            component: DashboardPageComponent,
          },
          {
            path: "add",
            component: AddPageComponent,
          },
          {
            path: "orders",
            component: OrdersPageComponent,
          },
          {
            path: "product/:id/edit",
            component: EditPageComponent,
          },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
  declarations: [
    AdminLayoutComponent,
    DashboardPageComponent,
    AddPageComponent,
    EditPageComponent,
    OrdersPageComponent,
    SearchPipe,
  ],
})
export class AdminModule {}
