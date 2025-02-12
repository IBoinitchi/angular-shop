import { Injectable, inject } from "@angular/core";
import { from, Observable, ReplaySubject, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { RoleTypeEnum } from "../models/roleTypeEnum";
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from "@angular/fire/auth";
import { AuthUser } from "../models/interfaces";
import { ErrorService } from "./error.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private defaultAdminRole = RoleTypeEnum.MODERATOR;
  private auth = inject(Auth);
  private errorService = inject(ErrorService);

  private currentUserSubject = new ReplaySubject<AuthUser | null>(1);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.initCurrentUser();
  }

  private setUserAuthorizationInfo(user: User): Observable<AuthUser> {
    return from(user.getIdTokenResult()).pipe(
      map((tokenInfo: any) => {
        return {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          role: tokenInfo.claims?.role || this.defaultAdminRole,
          canBeDeleted: tokenInfo.claims?.canBeDeleted,
          token: tokenInfo.token,
          tokenExp: tokenInfo.expirationTime,
          lastSignInTime: user.metadata.lastSignInTime,
        };
      })
    );
  }

  private initCurrentUser(): void {
    this.auth.onAuthStateChanged((user) => {
      if (user === null) {
        return this.currentUserSubject.next(user);
      }

      this.setUserAuthorizationInfo(user).subscribe({
        next: (user: AuthUser) => {
          this.currentUserSubject.next(user);
        },
        error: (error) => {
          throw error;
        },
      });
    });

    // authState(this.auth)
    //   .pipe(
    //     // filter(Boolean),
    //     switchMap((user: User) => {
    //       console.log("initCurrentUser->switchMap", user);
    //       return user ? this.setUserAuthorizationInfo(user) : [null];
    //     })
    //   )
    //   .subscribe({
    //     next: (user: AuthUser) => {
    //       console.log("initCurrentUser->subscribe", user);

    //       this.currentUserSubject.next(user);
    //     },
    //   });
  }

  login(email: string, password: string): Observable<AuthUser> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential: UserCredential) =>
        this.setUserAuthorizationInfo(userCredential?.user)
      )
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    signOut(this.auth);
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user: AuthUser) => {
        return user !== null && new Date() < new Date(user.tokenExp);
      })
    );
  }
}
