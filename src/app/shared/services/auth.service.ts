import { Injectable, OnDestroy, inject } from "@angular/core";
import { BehaviorSubject, from, Observable, of, Subject } from "rxjs";
import { catchError, switchMap, takeUntil } from "rxjs/operators";
import { RoleTypeEnum } from "../models/roleTypeEnum";
import { Auth, signInWithEmailAndPassword, signOut } from "@angular/fire/auth";
import { StorageData } from "../models/interfaces";

@Injectable({
  providedIn: "root",
})
export class AuthService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private auth = inject(Auth);
  private defaultAdminRole = RoleTypeEnum.MODERATOR;
  private userRoleSubject = new BehaviorSubject<string | null>(null);

  get token(): string | null {
    const expDate = new Date(localStorage.getItem("token-exp"));
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem("token");
  }

	get userName (): string| null {
		return localStorage.getItem("user");
	}

  async loadUserRole(): Promise<void> {
    const role = await this.getUserRoleFromFirebase();
    this.userRoleSubject.next(role);
  }

	getUserRole(): Observable<string | null> {
    return this.userRoleSubject.asObservable();
  }

  private async getUserRoleFromFirebase(): Promise<any> {
    return this.auth.authStateReady().then(async() => {
      const token = await this.auth.currentUser?.getIdTokenResult();
      return token?.claims?.role || this.defaultAdminRole;
    });
  }

  private setStorageData(response: StorageData | null): void {
    if (response) {
      localStorage.setItem(
        "token-exp",
        new Date(response.expirationTime).toString()
      );
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("user", response.userName);
    } else {
      localStorage.clear();
    }
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
			switchMap(async (userCredential) => {
				const userToken = await userCredential.user.getIdTokenResult();
				const role: any = userToken.claims?.role || this.defaultAdminRole;
				
				const storageData: StorageData = {
          accessToken: userToken.token,
          expirationTime: userToken.expirationTime,
          userName: userCredential.user.displayName,
        };

        this.userRoleSubject.next(role);
        this.setStorageData(storageData);
				return userCredential;
			}),
      catchError((error) => {
        console.error("Login error: ", error);
        return of(null);
      }),
      takeUntil(this.destroy$)
    );
  }

  logout(): void {
    this.setStorageData(null);
    signOut(this.auth);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
