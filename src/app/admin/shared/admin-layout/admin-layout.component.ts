import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/services/auth.service";
import { RoleTypeEnum } from "src/app/shared/models/roleTypeEnum";

@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.component.html",
  styleUrls: ["./admin-layout.component.scss"],
})
export class AdminLayoutComponent {
	userName: string;
  
  constructor(private authService: AuthService, private router: Router) {
    this.userName = this.authService.userName;
  }

  userRoleType = RoleTypeEnum;

  logout($event) {
    $event.preventDefault();
    this.authService.logout();
    this.router.navigate(["/admin", "login"]);
  }
}
