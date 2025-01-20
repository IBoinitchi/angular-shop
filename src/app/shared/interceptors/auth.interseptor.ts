import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.auth.isAuthenticated()) {
      httpRequest = httpRequest.clone({
        setParams: {
          auth: this.auth.token,
        },
      });
    }

    return next.handle(httpRequest).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.auth.logout();
          this.router.navigate(["/admin", "login"]);
        }

        return throwError(error);
      })
    );
  }
}
