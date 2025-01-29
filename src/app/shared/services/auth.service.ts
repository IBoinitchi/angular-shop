import { Injectable, OnDestroy, inject } from "@angular/core";
import { BehaviorSubject, combineLatest, from, Observable, of, Subject } from "rxjs";
import { catchError, switchMap, takeUntil, tap } from "rxjs/operators";
import { RoleTypeEnum } from "../models/roleTypeEnum";
import { Auth, signInWithEmailAndPassword, signOut } from "@angular/fire/auth";
import { RoleService } from "./role.service";
import { Role, StorageData } from "../models/interfaces";
import { Functions, httpsCallable, connectFunctionsEmulator, getFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: "root",
})
export class AuthService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private auth = inject(Auth);
  private roleService = inject(RoleService);
  private defaultAdminRole = RoleTypeEnum.MODERATOR;
  private functions = inject(Functions);
  private userRoleSubject = new BehaviorSubject<string | null>(null);

  get token(): string | null {
    const expDate = new Date(localStorage.getItem("token-exp"));
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem("token");
  }

  async loadUserRole(): Promise<void> {
    const role = await this.getUserRoleFromFirebase();
    this.userRoleSubject.next(role);
  }

  private async getUserRoleFromFirebase(): Promise<any> {
    return this.auth.authStateReady().then(async() => {
      const token = await this.auth.currentUser?.getIdTokenResult();
      return token?.claims?.role || this.defaultAdminRole;
    });
  }

  getUserRole(): Observable<string | null> {
    return this.userRoleSubject.asObservable();
  }

  updateUserRole(uid: string, role: string): Observable<any> {
    // const callable: any = httpsCallable(this.functions, 'updateUserRole');
    const emulator: any = connectFunctionsEmulator(this.functions, '127.0.0.1', 5001);
    const callable: any = httpsCallable(getFunctions(emulator), 'updateUserRole');
    console.log(callable);
    if (callable) {
      return callable({ uid, role });
    }
    return null;
  }

  private setStorageData(response: StorageData | null): void {
    if (response) {
      localStorage.setItem(
        "token-exp",
        new Date(response.expirationTime).toString()
      );
      localStorage.setItem("token", response.accessToken);
    } else {
      localStorage.clear();
    }
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) => {
        // console.log(userCredential.user.getIdToken(true));
        // https://www.learnrxjs.io/learn-rxjs/operators/combination/combinelatest
        return combineLatest([
          this.roleService.getOneById(userCredential.user.uid),
          of(userCredential.user),
        ])
  	  }),
      tap(([userRole, userData]: [Role | null, any]) => {
        if (!userRole) {
          userRole = { role: this.defaultAdminRole };
          this.roleService
            .createOrUpdateRoleByUid(userData.uid, {
              email: userData.email,
              role: userRole.role,
              name: "New User",
              canBeDeleted: true,
            });
        }
        
        // const t = from(this.updateUserRole(userData.uid, RoleTypeEnum.SUPER_ADMIN))
        // .pipe(
        //   map(data=> {
        //   console.log(data);
        //   return from(userData.getIdToken(true));
        // }));
        // // userData.reload();
        
        // console.log(t);
        
        const storageData: StorageData = {
          accessToken: userData.stsTokenManager.accessToken,
          expirationTime: userData.stsTokenManager.expirationTime,
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
