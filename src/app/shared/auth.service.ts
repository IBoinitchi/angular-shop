import { Injectable, OnDestroy } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { from, Observable, of, Subject } from "rxjs";
import { catchError, switchMap, tap, map, takeUntil } from "rxjs/operators";
import { RoleTypeEnum } from "./roleTypeEnum";

@Injectable({
  providedIn: "root",
})
export class AuthService implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {}

  login(email: string, password: string): Observable<any> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      switchMap((userCredential) => {
        const user = userCredential.user;
        return this.checkUserInDatabase(user);
      }),
      catchError((error) => {
        console.error("Login error: ", error);
        return of(null);
      }),
      takeUntil(this.destroy$)
    );
  }

  private checkUserInDatabase(user): Observable<any> {
    if (!user.uid) {
      return of(null);
    }

    return from(this.db.object(`/users/${user.uid}`).snapshotChanges()).pipe(
      map((snapshot) => snapshot.payload.val()),
      tap((userData: any) => {
        const tokenManager = user.multiFactor.user.stsTokenManager;

        if (!userData) {
          this.createUser(user);
          tokenManager.role = RoleTypeEnum.MODERATOR;
        } else {
          tokenManager.role = userData.role;
        }

        this.setToken(tokenManager);
      }),
      takeUntil(this.destroy$)
    );
  }

  private createUser(user) {
    const userData = {
      email: user.email,
      role: RoleTypeEnum.MODERATOR,
      name: "New User",
      canBeDeleted: true,
    };

    this.db.object(`/users/${user.uid}`).set(userData);
  }

  private setToken(response) {
    if (response) {
      localStorage.setItem(
        "token-exp",
        new Date(response.expirationTime).toString()
      );
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("role", response.role);
    } else {
      localStorage.clear();
    }
  }

  get token() {
    const expDate = new Date(localStorage.getItem("token-exp"));

    if (new Date() > expDate) {
      this.logout();
      return null;
    }

    return localStorage.getItem("token");
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated() {
    return !!this.token;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
