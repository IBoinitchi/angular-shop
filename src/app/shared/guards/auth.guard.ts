import { Injectable } from "@angular/core";
import { UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.isAuthenticated().pipe(
      map((status: boolean) => {
        if (status) {
          return true;
        } else {
          this.router.navigate(["/login"]);
          return false;
        }
      })
    );
  }
}
