import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/services/auth.service";
import { RoleTypeEnum } from "src/app/shared/models/roleTypeEnum";
import { AuthenticateUser } from "src/app/shared/models/interfaces";
import { Observable } from "rxjs";

@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.component.html",
  styleUrls: ["./admin-layout.component.scss"],
})
export class AdminLayoutComponent {
  currentUser$: Observable<AuthenticateUser> = null;
  userRoleType = RoleTypeEnum;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser$ = this.authService.currentUser$;
  }

  logout($event: Event): void {
    $event.preventDefault();
    this.authService.logout();
    this.router.navigate(["login"]);
  }
}
