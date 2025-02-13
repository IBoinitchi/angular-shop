import { Injectable, inject } from "@angular/core";
import { from, Observable, ReplaySubject } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { RoleTypeEnum } from "../models/roleTypeEnum";
import {
  Auth,
  IdTokenResult,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from "@angular/fire/auth";
import { AuthenticateUser } from "../models/interfaces";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private defaultAdminRole = RoleTypeEnum.MODERATOR;
  private auth = inject(Auth);

  private currentUserSubject = new ReplaySubject<AuthenticateUser | null>(1);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.initCurrentUser();
  }

  private setUserAuthorizationInfo(user: User): Observable<AuthenticateUser> {
    return from(user.getIdTokenResult()).pipe(
      map((tokenInfo: IdTokenResult) => {
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
    this.auth.onAuthStateChanged((user: User) => {
      if (user === null) {
        return this.currentUserSubject.next(null);
      }

      this.setUserAuthorizationInfo(user).subscribe({
        next: (user: AuthenticateUser) => {
          this.currentUserSubject.next(user);
        },
      });
    });
  }

  login(email: string, password: string): Observable<AuthenticateUser> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential: UserCredential) =>
        this.setUserAuthorizationInfo(userCredential.user)
      )
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    signOut(this.auth);
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user: AuthenticateUser) => {
        return user !== null && new Date() < new Date(user.tokenExp);
      })
    );
  }
}
