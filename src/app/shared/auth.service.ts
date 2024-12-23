import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { from, Observable, of } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { RoleTypeEnum } from "./roleTypeEnum";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {}

  login(email: string, password: string): Observable<any> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      switchMap((userCredential) =>
        this.checkUserInDatabase(userCredential.user)
      ),
      catchError((error) => {
        console.error("Login error: ", error);
        return of(null);
      })
    );
  }

  private checkUserInDatabase(user): Observable<any> {
    if (!user.uid) {
      return of(null);
    }

    return from(this.db.object(`/users/${user.uid}`).valueChanges()).pipe(
      tap((userData) => {
        const tokenManager = user.multiFactor.user.stsTokenManager;
        if (!userData) {
          tokenManager.role = this.createUser(user).role;
        } else {
          tokenManager.role = userData.role;
        }

        this.setToken(tokenManager);
      })
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
    return userData;
  }

  //   // Logout
  //   logout() {
  //     this.afAuth.signOut();
  //   }

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
      this.afAuth.signOut();
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
}
