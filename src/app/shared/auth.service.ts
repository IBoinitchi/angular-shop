import { Injectable, OnDestroy, inject } from "@angular/core";
import { combineLatest, from, Observable, of, Subject } from "rxjs";
import { catchError, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { RoleTypeEnum } from "./roleTypeEnum";
import { Auth, signInWithEmailAndPassword } from "@angular/fire/auth";
import { RoleService } from "./role.service";
import { Role, StorageData } from "./interfaces";

@Injectable({
  providedIn: "root",
})
export class AuthService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private auth = inject(Auth);
  private roleService = inject(RoleService);
  private defaultAdminRole = RoleTypeEnum.MODERATOR;

  get token(): string | null {
    const expDate = new Date(localStorage.getItem("token-exp"));
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem("token");
  }

  get role(): string {
    return localStorage.getItem("role") || "";
  }

  private setStorageData(response: StorageData | null): void {
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

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) =>
        // https://www.learnrxjs.io/learn-rxjs/operators/combination/combinelatest
        combineLatest([
          from(this.roleService.getRoleByUserId(userCredential.user.uid)),
          of(userCredential.user),
        ])
      ),
      tap(([userRole, userData]: [Role | null, any]) => {
        if (!userRole) {
          userRole = { role: this.defaultAdminRole };
          this.roleService.createOrUpdateRoleByUid(userData.uid, {
            email: userData.email,
            role: userRole.role,
            name: "New User",
            canBeDeleted: true,
          });
        }
        const storageData: StorageData = {
          accessToken: userData.stsTokenManager.accessToken,
          expirationTime: userData.stsTokenManager.expirationTime,
          role: userRole.role,
        };

        this.setStorageData(storageData);
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
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
