import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "src/app/shared/services/auth.service";
import { User } from "../models/interfaces";

@Injectable({
  providedIn: "root",
})
export class RoleGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const routeAccessRoles = next?.data?.roles || [];

    return this.authService.currentUser$.pipe(
      map((user: User) => {
        const userRole = user?.role;

        if (
          routeAccessRoles.includes(userRole) ||
          routeAccessRoles.includes("*")
        ) {
          return true;
        }
        this.router.navigate(["/admin/products"]);
        return false;
      })
    );
  }
}
