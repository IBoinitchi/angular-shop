import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AuthService } from "src/app/shared/services/auth.service";

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

	return this.authService.getUserRole().pipe(
    map((userRole) => {
      if (routeAccessRoles.includes(userRole) || routeAccessRoles.includes("*")) {
        return true;
      }
      this.router.navigate(["/admin/products"]);
      return false;
    }));
  }
}
